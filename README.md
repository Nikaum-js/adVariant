# AdVariant

> Do briefing às copies aprovadas em minutos.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.x-61dafb)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646cff)](https://vite.dev/)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

[**Abrir App**](https://ad-variant.vercel.app/)

---

## O Problema

Times de mídia e agências de publicidade enfrentam um gargalo toda semana: criar variações de copy para testes A/B em campanhas pagas.

O processo hoje:

1. Cliente aprova o briefing
2. Copywriter abre Google Docs e escreve variações manualmente
3. Cada canal (Meta, Google, LinkedIn) tem limites diferentes de caracteres — confere na mão
4. Manda por email, feedback volta por WhatsApp
5. Ninguém sabe qual versão foi aprovada no final

**Resultado:** 2-3 horas de trabalho mecânico por campanha. Retrabalho frequente. Copies genéricas porque o tempo acabou.

Esse não é um problema de criatividade. É um problema de processo.

---

## A Solução

**AdVariant** transforma um briefing em dezenas de variações de copy prontas para uso, respeitando os limites de cada canal e variando estratégias de persuasão automaticamente.

```
Briefing → Configuração → Geração com IA → Aprovação → Exportação
```

Sem cadastro. Sem backend persistente. Roda direto no navegador.

---

## Quem Usa e Quando

| Perfil                    | Momento de uso                                                                       |
| ------------------------- | ------------------------------------------------------------------------------------ |
| **Gestor de mídia**       | Início de campanha, quando precisa de variações para subir no Meta Ads ou Google Ads |
| **Copywriter**            | Quando tem briefing em mãos e precisa escalar produção rapidamente                   |
| **Analista de marketing** | Quando está configurando teste A/B e precisa de copies estruturadas                  |
| **Dono de agência**       | Quando quer padronizar o processo de criação sem contratar mais gente                |

---

## Como Funciona

1. **Preenche o briefing** — Produto, público, objetivo, diferenciais, palavras obrigatórias/proibidas
2. **Escolhe canal e tom** — Google Ads, Meta Ads ou LinkedIn Ads + tom de voz (urgente, inspiracional, direto...)
3. **IA gera variações** — Respeita limites de caracteres, varia estratégias de persuasão (prova social, escassez, benefício direto...)
4. **Aprova ou reprova** — Cards com contador de caracteres, tag de estratégia, botões de ação
5. **Exporta CSV** — Compatível com upload em massa no Ads Manager

---

## O Diferencial Técnico

LLMs não contam caracteres com precisão. Ao pedir "máximo 30 caracteres", frequentemente geram textos com 35-40.

### A Iteração

1. **Tentativa 1 — Margem fixa de 5 chars:** Falhou. 5 chars é 17% do limite do Google Ads, mas apenas 3% do LinkedIn. Desproporcional.

2. **Tentativa 2 — Margem percentual fixa (10%):** Melhor, mas inconsistente. Limites curtos ainda tinham mais erros.

3. **Solução final — Margem dinâmica por faixa:**

| Faixa de limite | Margem | Exemplo   |
| --------------- | ------ | --------- |
| ≤ 40 chars      | 15%    | 30 → 25   |
| 41-100 chars    | 10%    | 90 → 81   |
| > 100 chars     | 5%     | 125 → 118 |

### Few-Shot Examples Calibrados

Outro problema: a IA estava sendo conservadora demais. Headlines de 30 chars saíam com 12-15.

**Diagnóstico:** Os exemplos no prompt eram muito curtos. A IA os usava como referência de tamanho.

**Solução:** Exemplos calibrados para ~70% do limite de cada canal.

### Taxas de Aprovação

| Canal                       | Aprovadas | Taxa |
| --------------------------- | --------- | ---- |
| Google Ads (30/90 chars)    | 19/20     | 95%  |
| Meta Ads (40/125 chars)     | 15/20     | 75%  |
| LinkedIn Ads (70/150 chars) | 20/20     | 100% |

> Documentação completa: [TECHNICAL_DECISIONS.md](./TECHNICAL_DECISIONS.md)

---

## Stack

| Categoria     | Tecnologia                   |
| ------------- | ---------------------------- |
| Framework     | React 18 + Vite + TypeScript |
| Estilização   | Tailwind CSS                 |
| Componentes   | shadcn/ui                    |
| Ícones        | Lucide Icons                 |
| Data Fetching | TanStack Query               |
| Validação     | Zod                          |
| IA            | DeepSeek API                 |

---

## Como Rodar

```bash
# Clonar
git clone https://github.com/seu-usuario/advariant.git
cd advariant

# Instalar
pnpm install

# Configurar API key
cp .env.example .env
# Editar .env com sua chave DeepSeek

# Rodar
pnpm dev
```

### Scripts

```bash
pnpm dev        # Desenvolvimento
pnpm build      # Build de produção (inclui lint e testes)
pnpm test       # Testes em watch mode
pnpm test:run   # Testes uma vez
```

---

## Documentação Adicional

| Arquivo                                            | Conteúdo                                                 |
| -------------------------------------------------- | -------------------------------------------------------- |
| [PRODUCT.md](./PRODUCT.md)                         | Regras de negócio, funcionalidades, estados da aplicação |
| [AI.md](./AI.md)                                   | Sistema de IA: margens, prompts, few-shot examples       |
| [TECHNICAL_DECISIONS.md](./TECHNICAL_DECISIONS.md) | Decisões de engenharia e iterações                       |
| [STACK.md](./STACK.md)                             | Stack técnica e padrões de código                        |

---

## Canais Suportados

| Canal        | Headline | Descrição |
| ------------ | -------- | --------- |
| Google Ads   | 30 chars | 90 chars  |
| Meta Ads     | 40 chars | 125 chars |
| LinkedIn Ads | 70 chars | 150 chars |
