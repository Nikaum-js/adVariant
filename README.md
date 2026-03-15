# AdVariant

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.x-61dafb)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646cff)](https://vite.dev/)

Gerador inteligente de variações de copy para anúncios digitais. Do briefing às copies aprovadas em minutos.

## Como rodar localmente

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/advariant.git
cd advariant

# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env e adicionar sua chave da API DeepSeek

# Rodar em desenvolvimento
pnpm dev
```

## Variáveis de ambiente

| Variável               | Descrição                     | Obrigatória |
| ---------------------- | ----------------------------- | ----------- |
| `VITE_DEEPSEEK_API_KEY` | Chave da API DeepSeek        | Sim         |

## Scripts disponíveis

```bash
pnpm dev          # Servidor de desenvolvimento
pnpm build        # Build de produção
pnpm preview      # Preview do build
pnpm lint         # Verificar código
pnpm format       # Formatar código
pnpm test         # Rodar testes
pnpm test:run     # Rodar testes (sem watch)
```

## Documentação

- [PRODUCT.md](./PRODUCT.md) — Regras de negócio e funcionalidades
- [STACK.md](./STACK.md) — Stack técnica e padrões de código
- [AI.md](./AI.md) — Sistema de geração com IA (margens, prompts, few-shot examples)

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

## Canais suportados

| Canal        | Headline | Descrição |
| ------------ | -------- | --------- |
| Google Ads   | 30 chars | 90 chars  |
| Meta Ads     | 40 chars | 125 chars |
| LinkedIn Ads | 70 chars | 150 chars |
