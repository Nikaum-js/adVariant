# Sistema de Geração com IA

Documentação técnica do sistema de geração de copies do AdVariant.

## Visão Geral

O AdVariant usa a **DeepSeek API** (compatível com OpenAI) para gerar variações de copy. O diferencial está no **prompt engineering** otimizado para respeitar limites de caracteres.

**Arquivo principal:** `src/services/deepseek.ts`

---

## Margem Dinâmica de Caracteres

### O Problema

LLMs não contam caracteres com precisão. Ao pedir "máximo 30 caracteres", frequentemente geram textos com 35-40 chars. Uma margem de segurança fixa não funciona bem porque:

- Margem de 5 chars em limite de 30 = 17% (muito)
- Margem de 5 chars em limite de 150 = 3% (pouco)

### A Solução

Margem **proporcional** ao tamanho do limite:

| Faixa de limite | Margem | Justificativa                               |
|-----------------|--------|---------------------------------------------|
| ≤ 40 chars      | 15%    | Limites curtos precisam de mais margem      |
| 41-100 chars    | 10%    | Limites médios, margem moderada             |
| > 100 chars     | 5%     | Limites longos, menos chance de ultrapassar |

### Limites Efetivos por Canal

| Canal        | Campo      | Limite Real | Limite Efetivo | Margem |
|--------------|------------|-------------|----------------|--------|
| Google Ads   | Headline   | 30          | 25             | 15%    |
| Google Ads   | Descrição  | 90          | 81             | 10%    |
| Meta Ads     | Headline   | 40          | 34             | 15%    |
| Meta Ads     | Descrição  | 125         | 118            | 5%     |
| LinkedIn Ads | Headline   | 70          | 63             | 10%    |
| LinkedIn Ads | Descrição  | 150         | 142            | 5%     |

### Implementação

```typescript
function getEffectiveLimit(limit: number): number {
  if (limit <= 40) {
    return Math.floor(limit * 0.85) // 15% margem
  } else if (limit <= 100) {
    return Math.floor(limit * 0.9) // 10% margem
  } else {
    return Math.floor(limit * 0.95) // 5% margem
  }
}
```

---

## Few-Shot Examples por Canal

### O Problema

Se os exemplos no prompt são muito curtos (ex: headlines de 12 chars), a IA tende a ser conservadora em **todos** os canais, mesmo quando há espaço disponível.

### A Solução

Exemplos calibrados para **~70% do limite** de cada canal:

| Canal        | Limite Headline | Tamanho dos Examples |
|--------------|-----------------|----------------------|
| Google Ads   | 30 chars        | ~18-20 chars         |
| Meta Ads     | 40 chars        | ~28-35 chars         |
| LinkedIn Ads | 70 chars        | ~50-60 chars         |

### Exemplos por Canal

**Google Ads (≤30 chars):**
```
"Economize 50% hoje" (18 chars)
"Frete grátis Brasil" (19 chars)
```

**Meta Ads (31-45 chars):**
```
"Descubra como economizar 50% hoje" (34 chars)
"Transforme sua rotina em apenas 7 dias" (39 chars)
```

**LinkedIn Ads (>45 chars):**
```
"Descubra como profissionais de sucesso alcançam resultados extraordinários" (75 chars)
"A solução completa que sua empresa precisa para crescer em 2024" (63 chars)
```

### Implementação

```typescript
function generateFewShotExamples(headlineLimit: number): string {
  let examples: { headline: string; description: string }[]

  if (headlineLimit <= 30) {
    // Google Ads - exemplos curtos
    examples = [
      { headline: 'Economize 50% hoje', description: '...' },
      { headline: 'Frete grátis Brasil', description: '...' },
    ]
  } else if (headlineLimit <= 45) {
    // Meta Ads - exemplos médios
    examples = [
      { headline: 'Descubra como economizar 50% hoje', description: '...' },
      { headline: 'Transforme sua rotina em apenas 7 dias', description: '...' },
    ]
  } else {
    // LinkedIn Ads - exemplos longos
    examples = [
      { headline: 'Descubra como profissionais...', description: '...' },
      { headline: 'A solução completa que sua empresa...', description: '...' },
    ]
  }

  return examples.map((ex, i) =>
    `${i + 1}. Headline: "${ex.headline}" (${ex.headline.length} chars)`
  ).join('\n')
}
```

---

## Prompt Engineering

### System Message

Enfatiza a criticidade dos limites de caracteres:

```typescript
{
  role: 'system',
  content: 'Você é um copywriter especialista em anúncios digitais. ' +
    'REGRA CRÍTICA: NUNCA exceda os limites de caracteres - ' +
    'textos acima do limite são AUTOMATICAMENTE REJEITADOS e desperdiçam o trabalho. ' +
    'Conte os caracteres ANTES de responder. Sempre responda em JSON válido.',
}
```

### User Prompt

Estrutura do prompt com ênfase nos limites:

```
## ⚠️ LIMITES OBRIGATÓRIOS - SERÃO REJEITADOS SE EXCEDER
- Headline: MÁXIMO {limite_efetivo} caracteres (CONTE ANTES DE ESCREVER)
- Descrição: MÁXIMO {limite_efetivo} caracteres (CONTE ANTES DE ESCREVER)

ATENÇÃO: Qualquer texto acima desses limites será AUTOMATICAMENTE DESCARTADO.
Verifique a contagem de CADA variação antes de incluir no JSON.

## EXEMPLOS DE TAMANHO CORRETO
{few_shot_examples}

Seus textos devem ter tamanho SIMILAR aos exemplos acima.
Utilize bem o espaço disponível, mas NUNCA ultrapasse os limites.

## BRIEFING
- Produto: ...
- Público: ...
- Objetivo: ...
- Diferenciais: ...

## RESTRIÇÕES
- Palavras obrigatórias: ...
- Palavras proibidas: ...

## TOM
{descrição_detalhada_do_tom}

## ESTRATÉGIAS (use uma diferente por variação)
- social_proof, direct_benefit, scarcity, provocative_question, authority, transformation

Responda APENAS com JSON válido.
```

---

## Taxas de Aprovação

Resultados observados com o sistema de margem dinâmica + few-shot examples:

| Canal        | Aprovadas | Rejeitadas | Taxa de Aprovação |
|--------------|-----------|------------|-------------------|
| Google Ads   | 19        | 1          | **95%**           |
| Meta Ads     | 15        | 5          | **75%**           |
| LinkedIn Ads | 20        | 0          | **100%**          |

### Análise

- **Google Ads (30/90):** 95% aprovação. Headlines ficam entre 20-29 chars.
- **Meta Ads (40/125):** 75% aprovação. Headlines ficam entre 29-40 chars. Maior variação.
- **LinkedIn Ads (70/150):** 100% aprovação. Headlines ficam entre 38-59 chars. Mais espaço = menos erros.

---

## Validação no Frontend

Variações que excedem o limite são marcadas como `rejected` automaticamente:

```typescript
return variations.map((v) => {
  const isOverLimit =
    v.headline.length > channelRules.headlineLimit ||
    v.description.length > channelRules.descriptionLimit

  return {
    ...v,
    status: isOverLimit ? 'rejected' : 'pending',
  }
})
```

O `CharCounter` exibe cores semânticas:
- **Verde:** < 90% do limite
- **Amarelo:** 90-100% do limite
- **Vermelho:** > 100% do limite

---

## Arquivos Relacionados

| Arquivo                       | Responsabilidade                          |
|-------------------------------|-------------------------------------------|
| `src/services/deepseek.ts`    | Chamada à API, prompt building            |
| `src/lib/axios.ts`            | Cliente HTTP, interceptors, error classes |
| `src/lib/channelRules.ts`     | Limites de caracteres por canal           |
| `src/components/variations/CharCounter.tsx` | Indicador visual de caracteres |
