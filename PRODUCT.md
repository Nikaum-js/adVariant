# AdVariant — Gerador Inteligente de Variações de Anúncio

> _Do briefing às copies aprovadas em minutos, não em horas._

---

## Sumário

- [O Problema](#o-problema)
- [A Solução](#a-solução)
- [Quem Usa](#quem-usa)
- [Funcionalidades](#funcionalidades)
- [O Prompt — O Coração do App](#o-prompt--o-coração-do-app)
- [Estados da Aplicação](#estados-da-aplicação)
- [Tratamento de Erros](#tratamento-de-erros)
- [Por Que Esse App Funciona](#por-que-esse-app-funciona)
- [Roadmap](#roadmap)

---

## O Problema

Times de mídia e agências de publicidade enfrentam um gargalo silencioso toda semana: a criação de variações de copy para testes A/B em campanhas pagas.

O processo hoje é assim:

1. O cliente aprova o briefing
2. O copywriter abre um Google Docs e começa a escrever variações manualmente
3. Cada canal (Meta, Google, LinkedIn) tem regras diferentes de caracteres — ele confere na mão
4. Manda pro atendimento revisar por e-mail
5. O gestor responde no WhatsApp com feedbacks misturados com outras conversas
6. Ninguém sabe qual versão foi aprovada no final

**Resultado:** 2 a 3 horas de trabalho mecânico e repetitivo por campanha. Retrabalho frequente. Copies genéricas porque o tempo acabou.

Esse não é um problema de criatividade. É um problema de processo — e processo é o que a tecnologia resolve bem.

---

## A Solução

**AdVariant** transforma um briefing em dezenas de variações de copy prontas para uso em minutos, com suporte a múltiplos canais, diferentes estratégias de persuasão e um fluxo de aprovação simples.

**O fluxo:**

```
Briefing → Configuração → Geração com IA → Aprovação → Exportação
```

Sem cadastro. Sem backend. Roda direto no navegador.

---

## Quem Usa

| Perfil                    | Momento de uso                                                                      |
| ------------------------- | ----------------------------------------------------------------------------------- |
| **Gestor de mídia**       | Início de campanha, quando precisa de variações pra subir no Meta Ads ou Google Ads |
| **Copywriter**            | Quando tem briefing em mão e precisa escalar produção                               |
| **Analista de marketing** | Quando está configurando um teste A/B e precisa de copies estruturadas              |
| **Dono de agência**       | Quando quer padronizar o processo de criação sem contratar mais gente               |

---

## Funcionalidades

### 1. Formulário de Briefing Estruturado

O usuário preenche:

- **Produto/Serviço:** O que está sendo anunciado
- **Público-alvo:** Quem vai ver o anúncio (idade, comportamento, contexto)
- **Objetivo:** Awareness, geração de leads, conversão direta, remarketing, lançamento
- **Diferenciais:** O que torna esse produto único
- **Palavras-chave obrigatórias:** Termos que devem aparecer (ex: nome da marca, promoção)
- **Palavras proibidas:** Termos que não podem aparecer (ex: concorrentes, termos sensíveis)

### 2. Configuração de Canal

O app conhece as regras de cada plataforma e as aplica automaticamente:

| Canal                             | Campo           | Limite                      |
| --------------------------------- | --------------- | --------------------------- |
| **Google Ads**                    | Headline        | 30 caracteres               |
| **Google Ads**                    | Descrição       | 90 caracteres               |
| **Meta Ads (Facebook/Instagram)** | Texto principal | 125 caracteres recomendados |
| **Meta Ads**                      | Headline        | 40 caracteres               |
| **LinkedIn Ads**                  | Headline        | 70 caracteres               |
| **LinkedIn Ads**                  | Texto           | 150 caracteres              |

O usuário seleciona o canal e o app garante que nenhuma variação gerada ultrapasse os limites.

### 3. Configuração de Tom e Estratégia

**Tom de voz:**

- Urgente / Escassez
- Inspiracional / Aspiracional
- Direto / Objetivo
- Emocional / Storytelling
- Humorístico / Descontraído
- Profissional / Técnico

**Quantidade de variações:** 5, 10, 15 ou 20

**Estratégias de persuasão (a IA varia entre elas):**

- Prova social ("Mais de 10.000 clientes confiam em...")
- Benefício direto ("Economize X% em...")
- Pergunta provocativa ("Ainda pagando caro por...?")
- Escassez/Urgência ("Só até domingo")
- Autoridade ("Recomendado por especialistas em...")
- Transformação ("De X para Y em Z dias")

> **Importante:** A IA não só varia as palavras — ela varia a abordagem de persuasão. Cada variação é estrategicamente diferente, não apenas uma paráfrase da anterior.

### 4. Geração com IA

A IA gera variações com base no briefing, respeitando:

- Limites de caracteres do canal selecionado
- Tom de voz configurado
- Palavras obrigatórias e proibidas
- Diversidade de estratégias de persuasão

O resultado é retornado em JSON estruturado para renderização em cards.

### 5. Tela de Aprovação

As variações são apresentadas em cards com:

- Headline e descrição separados
- Contador de caracteres com indicador visual (verde/amarelo/vermelho)
- Tag da estratégia de persuasão usada
- Botões: Aprovar / Reprovar / Regenerar essa variação

O gestor pode compartilhar a URL da sessão com qualquer pessoa — sem login, sem cadastro.

### 6. Exportação

Após a aprovação, o usuário exporta apenas as variações aprovadas:

- **CSV** — compatível com upload em massa no Meta Ads Manager e Google Ads
- **Copiar tudo** — copia todas as aprovadas pro clipboard em formato estruturado

---

## O Prompt — O Coração do App

O prompt enviado à IA é o diferencial técnico do projeto. Ele não pede "variações de copy" genericamente — ele instrui o modelo a variar a **estratégia de persuasão** em cada item:

```
Você é um especialista em copywriting para anúncios digitais.

Gere {N} variações de copy para o canal {CANAL}, seguindo as regras abaixo:

BRIEFING:
- Produto/Serviço: {PRODUTO}
- Público-alvo: {PUBLICO}
- Objetivo: {OBJETIVO}
- Diferenciais: {DIFERENCIAIS}

REGRAS DO CANAL:
- Headline: máximo {X} caracteres
- Descrição: máximo {Y} caracteres

RESTRIÇÕES:
- Palavras obrigatórias: {KEYWORDS}
- Palavras proibidas: {FORBIDDEN}

TOM DE VOZ: {TOM}

INSTRUÇÕES:
- Cada variação DEVE usar uma estratégia de persuasão diferente
- As estratégias disponíveis são: prova social, benefício direto, escassez/urgência,
  pergunta provocativa, autoridade, transformação
- NUNCA ultrapasse os limites de caracteres
- Inclua a estratégia usada em cada variação

Responda APENAS com um JSON válido no seguinte formato:
{
  "variations": [
    {
      "id": 1,
      "headline": "...",
      "description": "...",
      "strategy": "escassez",
      "charCount": { "headline": 28, "description": 87 }
    }
  ]
}
```

---

## Estados da Aplicação

```
idle          → O usuário está preenchendo o briefing
generating    → Chamada à API em andamento (loading state)
reviewing     → Variações geradas, usuário aprovando/reprovando
exporting     → Filtrando aprovadas e gerando arquivo
error         → Erro na geração, exibindo mensagem
```

Cada estado tem uma UI correspondente. O app nunca fica em estado ambíguo.

---

## Tratamento de Erros

| Cenário                           | Comportamento                                                  |
| --------------------------------- | -------------------------------------------------------------- |
| API key inválida                  | Toast com mensagem clara + link pra configurar                 |
| API key ausente                   | Modal solicitando a chave antes de permitir geração            |
| Rate limit da API                 | Mensagem explicando e botão pra tentar novamente após cooldown |
| Timeout na requisição             | Retry automático (até 2x) + opção manual                       |
| JSON malformado na resposta       | Fallback: tenta parsear parcialmente ou pede pra regenerar     |
| Campo vazio no briefing           | Validação inline antes de habilitar o botão de gerar           |
| Variação ultrapassou limite chars | Badge vermelho no card, aviso antes de exportar                |
| Erro de rede                      | Detecta offline e sugere verificar conexão                     |

---

## Por Que Esse App Funciona

### Resolve uma dor específica, não um problema genérico

Não é "um app de marketing com IA". É uma ferramenta para um momento preciso da rotina de um gestor de mídia: a criação de variações de copy no início de uma campanha.

### A IA tem um papel funcional, não decorativo

Ela não está lá pra parecer moderna. Ela está lá porque é o único componente capaz de variar estratégias de persuasão em escala sem ser um humano.

### O fluxo é inteiro

Briefing → Geração → Aprovação → Exportação. O usuário entra com um problema e sai com um resultado utilizável. Não é uma demo — é uma ferramenta.

### Sem fricção

Sem cadastro, sem onboarding, sem tutorial. Abre e usa.

---

## Roadmap

Se o tempo permitir, estas funcionalidades aumentam o impacto:

| Funcionalidade                | Descrição                                                            | Prioridade |
| ----------------------------- | -------------------------------------------------------------------- | ---------- |
| **Preview visual**            | Simula como a copy ficaria em um post de Instagram ou card de Google | Alta       |
| **Histórico de sessão**       | Mantém as últimas gerações no localStorage                           | Alta       |
| **Regeneração com instrução** | "Torna mais urgente" / "Remove o emoji" por variação individual      | Média      |
| **Multi-canal simultâneo**    | Gera versões para 2+ canais ao mesmo tempo                           | Média      |
| **Score da copy**             | A própria IA avalia e pontua cada variação (clareza, impacto, CTA)   | Baixa      |
| **Templates de briefing**     | Briefings pré-configurados por nicho (e-commerce, SaaS, serviços)    | Baixa      |

---

_Veja [STACK.md](./STACK.md) para detalhes técnicos de implementação._
