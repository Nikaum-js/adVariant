# Decisões Técnicas — AdVariant

> Documento para discussão técnica sobre as decisões de engenharia do projeto.

---

## O Desafio

O AdVariant gera variações de copy para anúncios usando a API do DeepSeek. Cada canal de ads tem limites rígidos de caracteres:

| Canal        | Headline | Descrição |
|--------------|----------|-----------|
| Google Ads   | 30 chars | 90 chars  |
| Meta Ads     | 40 chars | 125 chars |
| LinkedIn Ads | 70 chars | 150 chars |

**O problema:** LLMs não contam caracteres com precisão. Ao pedir "máximo 30 caracteres", frequentemente geram textos com 35-40 chars.

Isso resulta em variações rejeitadas, desperdício de tokens da API, e uma experiência ruim para o usuário.

---

## Primeira Tentativa: Margem Fixa

**Hipótese:** Subtrair uma margem fixa (ex: 5 chars) do limite resolveria o problema.

**Implementação:**
```typescript
const effectiveLimit = limit - 5
```

**Resultado:** Parcialmente eficaz, mas inconsistente.

| Canal        | Limite | Margem | % do limite |
|--------------|--------|--------|-------------|
| Google Ads   | 30     | 5      | 17%         |
| LinkedIn Ads | 150    | 5      | 3%          |

**Problema identificado:** 5 chars é 17% do limite do Google Ads, mas apenas 3% do LinkedIn. A margem fixa era desproporcional — muito conservadora para limites curtos, insuficiente para limites longos.

---

## Segunda Tentativa: Margem Proporcional

**Hipótese:** Uma margem percentual seria mais equilibrada.

**Implementação:**
```typescript
const effectiveLimit = Math.floor(limit * 0.9) // 10% margem
```

**Resultado:** Melhor, mas ainda não ideal.

Observei que limites curtos (30 chars) ainda tinham mais erros que limites longos (150 chars). Faz sentido: em 30 chars, cada palavra conta mais, então o erro relativo da LLM é maior.

---

## Solução Final: Margem Dinâmica por Faixa

**Hipótese:** Limites menores precisam de margem proporcionalmente maior.

**Implementação:**
```typescript
function getEffectiveLimit(limit: number): number {
  if (limit <= 40) {
    return Math.floor(limit * 0.85) // 15% margem
  } else if (limit <= 100) {
    return Math.floor(limit * 0.9)  // 10% margem
  } else {
    return Math.floor(limit * 0.95) // 5% margem
  }
}
```

**Resultado por canal:**

| Canal        | Limite Real | Limite Efetivo | Margem |
|--------------|-------------|----------------|--------|
| Google Ads   | 30 → 90     | 25 → 81        | 15%/10%|
| Meta Ads     | 40 → 125    | 34 → 118       | 15%/5% |
| LinkedIn Ads | 70 → 150    | 63 → 142       | 10%/5% |

---

## Problema Adicional: Textos Muito Curtos

Com a margem funcionando, surgiu outro problema: a LLM estava sendo **conservadora demais**. Headlines de 30 chars estavam saindo com 12-15 chars.

**Diagnóstico:** Os exemplos no prompt eram muito curtos. A LLM estava usando-os como referência de tamanho, não apenas de formato.

---

## Solução: Few-Shot Examples Calibrados

**Hipótese:** Exemplos que usam ~70% do limite mostrariam o tamanho esperado.

**Implementação:**
```typescript
function generateFewShotExamples(headlineLimit: number): string {
  if (headlineLimit <= 30) {
    // Google Ads - exemplos ~18-20 chars (60-70% de 30)
    return [
      'Headline: "Economize 50% hoje" (18 chars)',
      'Headline: "Frete grátis Brasil" (19 chars)',
    ]
  } else if (headlineLimit <= 45) {
    // Meta Ads - exemplos ~32-35 chars (70-80% de 40)
    return [
      'Headline: "Descubra como economizar 50% hoje" (34 chars)',
      'Headline: "Transforme sua rotina em apenas 7 dias" (39 chars)',
    ]
  } else {
    // LinkedIn Ads - exemplos ~55-60 chars (70-85% de 70)
    return [
      'Headline: "Descubra como profissionais de sucesso..." (55 chars)',
      'Headline: "A solução completa que sua empresa precisa..." (52 chars)',
    ]
  }
}
```

---

## Resultados Finais

Testei gerando 20 variações por canal:

| Canal        | Aprovadas | Rejeitadas | Taxa |
|--------------|-----------|------------|------|
| Google Ads   | 19        | 1          | 95%  |
| Meta Ads     | 15        | 5          | 75%  |
| LinkedIn Ads | 20        | 0          | 100% |

**Observações:**
- **Google Ads (95%):** Headlines ficam entre 20-29 chars. A margem de 15% funciona bem.
- **Meta Ads (75%):** Maior variação. O limite de 40 chars está na fronteira entre as faixas.
- **LinkedIn Ads (100%):** Mais espaço = menos erros. Margem de 10% é suficiente.

---

## O Que Não Funcionou

1. **Pedir para a LLM "contar caracteres"** — Ela conta errado consistentemente.

2. **Usar regex para validar no prompt** — LLMs não executam regex, apenas simulam.

3. **Margem fixa de 5-10 chars** — Desproporcional entre canais.

4. **Exemplos genéricos** — A LLM usa exemplos como referência de tamanho.

---

## Aprendizados

1. **LLMs são melhores em padrões que em contagem.** Em vez de pedir "máximo 30 chars", mostro exemplos do tamanho certo.

2. **Margem de segurança deve ser proporcional ao risco.** Limites curtos têm mais risco de erro, então precisam de mais margem.

3. **Validação no frontend é obrigatória.** Mesmo com 95% de aprovação, o frontend marca automaticamente variações acima do limite como rejeitadas.

4. **Few-shot learning é poderoso.** A qualidade dos exemplos impacta diretamente o output.

---

## Stack Técnica Relevante

| Decisão | Escolha | Justificativa |
|---------|---------|---------------|
| API de IA | DeepSeek | Compatível com OpenAI, custo menor |
| HTTP Client | Axios | Interceptors para tratamento de erro centralizado |
| State Management | TanStack Query | Cache, retry automático, estados de loading |
| Validação | Zod | Type-safe, integra com React Hook Form |

---

## Código-Fonte

- `src/services/deepseek.ts` — Geração de variações, prompt building
- `src/lib/axios.ts` — Cliente HTTP com interceptors
- `src/lib/channelRules.ts` — Limites por canal
- `src/components/variations/CharCounter.tsx` — Feedback visual de caracteres

---

## Possíveis Melhorias Futuras

1. **Retry automático com prompt ajustado** — Se uma variação excede o limite, regenerar apenas ela com limite mais restrito.

2. **Fine-tuning do modelo** — Treinar com exemplos de copies que respeitam limites.

3. **Análise de padrões de erro** — Identificar quais tipos de copy mais frequentemente excedem limites.

4. **A/B test de prompts** — Testar diferentes estruturas de prompt para otimizar taxa de aprovação.
