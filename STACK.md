# STACK.md — Guia Técnico para Desenvolvimento

> Este documento define a stack tecnológica e padrões que a IA deve seguir ao desenvolver o AdVariant.

---

## Sumário

- [Visão Geral da Stack](#visão-geral-da-stack)
- [Instalação e Setup](#instalação-e-setup)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Padrões de Código](#padrões-de-código)
- [Componentes com shadcn/ui](#componentes-com-shadcnui)
- [Ícones com Lucide](#ícones-com-lucide)
- [TanStack Query para API](#tanstack-query-para-api)
- [Validação com Zod](#validação-com-zod)
- [Tipos TypeScript](#tipos-typescript)
- [DeepSeek API](#deepseek-api)
- [Deploy](#deploy)

---

## Visão Geral da Stack

| Categoria         | Tecnologia                                     |
| ----------------- | ---------------------------------------------- |
| **Framework**     | React 18 + Vite                                |
| **Linguagem**     | TypeScript                                     |
| **Estilização**   | Tailwind CSS                                   |
| **Componentes**   | shadcn/ui                                      |
| **Ícones**        | Lucide Icons                                   |
| **Data Fetching** | TanStack Query (React Query)                   |
| **Formulários**   | TanStack Form (se complexo) ou React Hook Form |
| **Validação**     | Zod                                            |
| **Estado**        | React Context + TanStack Query                 |
| **IA**            | DeepSeek API (compatível OpenAI SDK)           |
| **Persistência**  | localStorage (sessão local)                    |
| **Exportação**    | SheetJS (xlsx)                                 |
| **Deploy**        | Vercel / Netlify                               |

---

## Instalação e Setup

```bash
# Criar projeto
pnpm create vite@latest advariant -- --template react-ts
cd advariant

# Instalar dependências core
pnpm install

# Tailwind CSS
pnpm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# shadcn/ui
pnpm dlx shadcn@latest init

# Componentes shadcn (adicionar conforme necessário)
pnpm dlx shadcn@latest add button card input label textarea select toast

# TanStack Query
pnpm install @tanstack/react-query

# Lucide Icons
pnpm install lucide-react

# Zod
pnpm install zod

# SheetJS para exportação CSV
pnpm install xlsx

# Configurar API key
cp .env.example .env
# Editar .env: VITE_DEEPSEEK_API_KEY=sua_chave_aqui

# Rodar em desenvolvimento
pnpm dev
```

### Arquivo `.env.example`

```
VITE_DEEPSEEK_API_KEY=sua_chave_aqui
```

---

## Estrutura de Pastas

```
advariant/
├── src/
│   ├── components/
│   │   ├── ui/                      ← componentes shadcn/ui
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── textarea.tsx
│   │   │   └── toast.tsx
│   │   │
│   │   ├── briefing/
│   │   │   └── BriefingForm.tsx     ← formulário principal
│   │   │
│   │   ├── config/
│   │   │   ├── ChannelSelector.tsx
│   │   │   └── ToneSelector.tsx
│   │   │
│   │   └── variations/
│   │       ├── VariationCard.tsx    ← card individual com approve/reject
│   │       ├── VariationGrid.tsx    ← grid de variações
│   │       └── CharCounter.tsx      ← contador visual de caracteres
│   │
│   ├── hooks/
│   │   ├── useGenerateVariations.ts ← TanStack Query mutation
│   │   └── useLocalStorage.ts       ← persistência local
│   │
│   ├── services/
│   │   ├── deepseek.ts              ← cliente da API
│   │   └── export.ts                ← lógica de exportação CSV
│   │
│   ├── lib/
│   │   ├── utils.ts                 ← cn() e utilitários shadcn
│   │   ├── queryClient.ts           ← configuração TanStack Query
│   │   └── channelRules.ts          ← limites de caracteres por canal
│   │
│   ├── schemas/
│   │   └── briefing.ts              ← schemas Zod
│   │
│   ├── types/
│   │   └── index.ts                 ← tipos TypeScript centralizados
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css                    ← Tailwind directives
│
├── components.json                  ← config shadcn/ui
├── tailwind.config.js
├── .env.example
├── PRODUCT.md
├── STACK.md
└── vite.config.ts
```

---

## Padrões de Código

### Convenções Gerais

- **Componentes:** PascalCase, um componente por arquivo
- **Hooks:** camelCase, prefixo `use`
- **Tipos:** PascalCase, sufixo descritivo (ex: `BriefingFormData`)
- **Schemas Zod:** camelCase, sufixo `Schema` (ex: `briefingSchema`)

### Imports

```typescript
// 1. React e hooks
import { useState, useCallback } from 'react'

// 2. Bibliotecas externas
import { useMutation } from '@tanstack/react-query'
import { Check, X, RefreshCw } from 'lucide-react'

// 3. Componentes UI (shadcn)
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// 4. Componentes internos
import { VariationCard } from '@/components/variations/VariationCard'

// 5. Hooks, services, utils
import { useGenerateVariations } from '@/hooks/useGenerateVariations'
import { cn } from '@/lib/utils'

// 6. Tipos
import type { Variation, Briefing } from '@/types'
```

### Path Aliases

Configurar no `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

E no `vite.config.ts`:

```typescript
import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

---

## Componentes com shadcn/ui

### Filosofia

shadcn/ui não é uma biblioteca — são componentes copiados para o projeto. Isso permite customização total.

### Instalando Componentes

```bash
# Adicionar componentes conforme necessário
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add input
pnpm dlx shadcn@latest add select
pnpm dlx shadcn@latest add toast
```

### Exemplo de Uso

```tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function VariationCard({ variation }: { variation: Variation }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{variation.headline}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{variation.description}</p>
        <div className="mt-4 flex gap-2">
          <Button variant="default">Aprovar</Button>
          <Button variant="destructive">Reprovar</Button>
        </div>
      </CardContent>
    </Card>
  )
}
```

---

## Ícones com Lucide

### Instalação

```bash
pnpm install lucide-react
```

### Uso

```tsx
import { Check, X, RefreshCw, Download, Copy } from 'lucide-react'

// Em componentes
<Button>
  <Check className="w-4 h-4 mr-2" />
  Aprovar
</Button>

<Button variant="destructive">
  <X className="w-4 h-4 mr-2" />
  Reprovar
</Button>

<Button variant="outline">
  <RefreshCw className="w-4 h-4 mr-2" />
  Regenerar
</Button>
```

### Ícones Recomendados para o App

| Ação          | Ícone           |
| ------------- | --------------- |
| Aprovar       | `Check`         |
| Reprovar      | `X`             |
| Regenerar     | `RefreshCw`     |
| Exportar CSV  | `Download`      |
| Copiar        | `Copy`          |
| Configurações | `Settings`      |
| Canal         | `Radio`         |
| Tom de voz    | `MessageSquare` |
| Loading       | `Loader2`       |
| Erro          | `AlertCircle`   |

---

## TanStack Query para API

### Setup

```typescript
// src/lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: 2,
    },
    mutations: {
      retry: 2,
    },
  },
})
```

```tsx
// src/main.tsx
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
)
```

### Hook de Geração

```typescript
// src/hooks/useGenerateVariations.ts
import { useMutation } from '@tanstack/react-query'
import { generateVariations } from '@/services/deepseek'
import type { Briefing, GenerationConfig, Variation } from '@/types'

interface GenerateParams {
  briefing: Briefing
  config: GenerationConfig
}

export function useGenerateVariations() {
  return useMutation({
    mutationFn: ({ briefing, config }: GenerateParams) => generateVariations(briefing, config),
    onError: (error) => {
      console.error('Erro na geração:', error)
    },
  })
}
```

### Uso no Componente

```tsx
function GenerateButton() {
  const { mutate, isPending, isError, error } = useGenerateVariations()

  const handleGenerate = () => {
    mutate(
      { briefing, config },
      {
        onSuccess: (variations) => {
          // Atualizar estado com variações
        },
      }
    )
  }

  return (
    <Button onClick={handleGenerate} disabled={isPending}>
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Gerando...
        </>
      ) : (
        'Gerar Variações'
      )}
    </Button>
  )
}
```

---

## Validação com Zod

### Schemas

```typescript
// src/schemas/briefing.ts
import { z } from 'zod'

export const briefingSchema = z.object({
  product: z.string().min(3, 'Descreva o produto/serviço'),
  targetAudience: z.string().min(3, 'Descreva o público-alvo'),
  objective: z.string().min(1, 'Selecione um objetivo'),
  differentials: z.string().min(3, 'Liste os diferenciais'),
  requiredKeywords: z.array(z.string()).default([]),
  forbiddenWords: z.array(z.string()).default([]),
})

export type BriefingFormData = z.infer<typeof briefingSchema>

export const generationConfigSchema = z.object({
  channel: z.enum(['google_ads', 'meta_ads', 'linkedin_ads']),
  tone: z.enum(['urgent', 'inspirational', 'direct', 'emotional', 'humorous', 'professional']),
  quantity: z.union([z.literal(5), z.literal(10), z.literal(15), z.literal(20)]),
})

export type GenerationConfigData = z.infer<typeof generationConfigSchema>
```

### Validação em Formulários

```typescript
import { briefingSchema, BriefingFormData } from '@/schemas/briefing'

function validateBriefing(data: unknown): BriefingFormData {
  return briefingSchema.parse(data)
}

// Ou para validação segura (sem throw)
function safeParseBriefing(data: unknown) {
  const result = briefingSchema.safeParse(data)
  if (!result.success) {
    return { success: false, errors: result.error.flatten() }
  }
  return { success: true, data: result.data }
}
```

---

## Tipos TypeScript

```typescript
// src/types/index.ts

export type Channel = 'google_ads' | 'meta_ads' | 'linkedin_ads'

export type Tone = 'urgent' | 'inspirational' | 'direct' | 'emotional' | 'humorous' | 'professional'

export type Strategy =
  | 'social_proof'
  | 'direct_benefit'
  | 'scarcity'
  | 'provocative_question'
  | 'authority'
  | 'transformation'

export type AppState = 'idle' | 'generating' | 'reviewing' | 'exporting' | 'error'

export type VariationStatus = 'pending' | 'approved' | 'rejected'

export interface Briefing {
  product: string
  targetAudience: string
  objective: string
  differentials: string
  requiredKeywords: string[]
  forbiddenWords: string[]
}

export interface ChannelRules {
  name: string
  headlineLimit: number
  descriptionLimit: number
}

export interface Variation {
  id: number
  headline: string
  description: string
  strategy: Strategy
  charCount: {
    headline: number
    description: number
  }
  status: VariationStatus
}

export interface GenerationConfig {
  channel: Channel
  tone: Tone
  quantity: 5 | 10 | 15 | 20
}

// Mapa de regras por canal
export const CHANNEL_RULES: Record<Channel, ChannelRules> = {
  google_ads: {
    name: 'Google Ads',
    headlineLimit: 30,
    descriptionLimit: 90,
  },
  meta_ads: {
    name: 'Meta Ads',
    headlineLimit: 40,
    descriptionLimit: 125,
  },
  linkedin_ads: {
    name: 'LinkedIn Ads',
    headlineLimit: 70,
    descriptionLimit: 150,
  },
}
```

---

## DeepSeek API

### Configuração

A API do DeepSeek é chamada via Axios com interceptors configurados em `src/lib/axios.ts`. O serviço principal está em `src/services/deepseek.ts`.

### Margem Dinâmica de Caracteres

LLMs não contam caracteres com precisão. Usamos uma margem proporcional ao tamanho do limite:

```typescript
// src/services/deepseek.ts

/**
 * Calcula o limite efetivo com margem proporcional ao tamanho
 * Limites menores precisam de mais margem, limites maiores precisam de menos
 */
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

### Few-Shot Examples por Canal

Exemplos calibrados evitam que a IA seja conservadora demais:

```typescript
/**
 * Gera exemplos few-shot calibrados por canal
 * Exemplos usam ~70% do limite para mostrar o tamanho esperado
 */
function generateFewShotExamples(headlineLimit: number): string {
  let examples: { headline: string; description: string }[]

  if (headlineLimit <= 30) {
    // Google Ads - exemplos curtos (~18 chars)
    examples = [
      { headline: 'Economize 50% hoje', description: '...' },
      { headline: 'Frete grátis Brasil', description: '...' },
    ]
  } else if (headlineLimit <= 45) {
    // Meta Ads - exemplos médios (~32 chars)
    examples = [
      { headline: 'Descubra como economizar 50% hoje', description: '...' },
      { headline: 'Transforme sua rotina em apenas 7 dias', description: '...' },
    ]
  } else {
    // LinkedIn Ads - exemplos longos (~55 chars)
    examples = [
      { headline: 'Descubra como profissionais de sucesso alcançam resultados extraordinários', description: '...' },
      { headline: 'A solução completa que sua empresa precisa para crescer em 2024', description: '...' },
    ]
  }

  return examples.map(...).join('\n')
}
```

### System Message

A system message enfatiza que textos acima do limite são rejeitados:

```typescript
{
  role: 'system',
  content: 'Você é um copywriter especialista em anúncios digitais. ' +
    'REGRA CRÍTICA: NUNCA exceda os limites de caracteres - ' +
    'textos acima do limite são AUTOMATICAMENTE REJEITADOS e desperdiçam o trabalho. ' +
    'Conte os caracteres ANTES de responder. Sempre responda em JSON válido.',
}
```

### Tratamento de Erros

O serviço re-exporta classes de erro de `src/lib/axios.ts`:

- `ApiKeyMissingError` — API key não configurada
- `ApiKeyInvalidError` — API key inválida (401)
- `RateLimitError` — Limite de requisições excedido (429)
- `NetworkError` — Erro de conexão

> Veja [AI.md](./AI.md) para documentação completa do sistema de IA.

---

## Deploy

O app é um build estático — pode ser deployado em qualquer CDN.

### Build

```bash
pnpm build
# A pasta /dist pode ser deployada no Vercel ou Netlify
```

### Checklist de Deploy

- [ ] Variável `VITE_DEEPSEEK_API_KEY` configurada no ambiente
- [ ] Build local funcionando (`pnpm build && pnpm preview`)
- [ ] Testes de geração com a API key de produção
- [ ] Verificar se CSP permite chamadas para `api.deepseek.com`

### Vercel

1. Conectar repositório
2. Adicionar variável de ambiente: `VITE_DEEPSEEK_API_KEY`
3. Deploy automático a cada push

### Netlify

1. Conectar repositório
2. Build command: `pnpm build`
3. Publish directory: `dist`
4. Adicionar variável de ambiente: `VITE_DEEPSEEK_API_KEY`

---

## Arquitetura: Sem Backend

Toda a lógica roda no navegador. A chave da API é injetada como variável de ambiente em build time.

```
Browser
  ├── React App (Vite build)
  │     ├── Formulário de briefing
  │     ├── Configuração de canal/tom
  │     ├── Cards de variações
  │     └── Exportação CSV
  │
  └── fetch() → api.deepseek.com/v1/chat/completions
```

Não há servidor, banco de dados, autenticação ou sessão persistida remotamente.

---

---

> **Nota:** Este documento é atualizado conforme a stack evolui. Última revisão: Março 2026.

_Veja [PRODUCT.md](./PRODUCT.md) para regras de negócio e funcionalidades._
