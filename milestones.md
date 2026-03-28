# milestones.md — AdVariant (MVP)

> **Instrução obrigatória para a IA que estiver executando este plano**
>
> 1. Sempre que concluir qualquer item, **marque o checkbox** (`[x]`).
> 2. Ao final de cada sessão/entrega, **atualize a seção "Status Atual (log)"** com:
>    - data
>    - o que foi concluído
>    - o que ficou pendente
>    - próximos passos imediatos
> 3. **Nunca apague o histórico** do "Status Atual (log)". Apenas acrescente novas entradas.
>
> **Regras de desenvolvimento (obrigatórias):**
>
> - Sempre usar componentes do **shadcn/ui** (não criar do zero)
> - Sempre usar ícones do **Lucide** (não usar outros pacotes)
> - Usar **TanStack Query** para chamadas à API
> - Validar formulários com **Zod**
> - Path alias: `@/` aponta para `./src/`
> - Seguir estrutura de pastas definida em STACK.md

---

## M0 — Setup & Deploy (Fundação)

- [x] Criar projeto Vite + React + TypeScript
- [x] Configurar Tailwind CSS
- [x] Configurar shadcn/ui (`components.json`, `utils.ts`, tsconfig paths)
- [x] Instalar dependências core:
  - [x] `@tanstack/react-query`
  - [x] `lucide-react`
  - [x] `zod`
  - [x] `xlsx` (para exportação)
- [x] Criar estrutura de pastas conforme STACK.md:
  - [x] `src/components/ui/`
  - [x] `src/components/briefing/`
  - [x] `src/components/config/`
  - [x] `src/components/variations/`
  - [x] `src/hooks/`
  - [x] `src/services/`
  - [x] `src/lib/`
  - [x] `src/schemas/`
  - [x] `src/types/`
- [x] Criar `.env.example` com `VITE_DEEPSEEK_API_KEY`
- [x] Configurar QueryClientProvider no `main.tsx`
- [x] Garantir build e preview funcionando sem erros

### Code Quality (obrigatório)

- [x] Instalar e configurar Prettier:
  - [x] `prettier`
  - [x] Criar `.prettierrc` com configurações do projeto
  - [x] Criar `.prettierignore`
- [x] Integrar ESLint + Prettier:
  - [x] `eslint-config-prettier` (desabilita regras conflitantes)
- [x] Configurar pre-commit hooks:
  - [x] `husky`
  - [x] `lint-staged`
  - [x] Rodar `pnpm exec husky init`
  - [x] Criar `.husky/pre-commit` com lint-staged
- [x] Adicionar scripts no package.json:
  - [x] `"format": "prettier --write ."`
  - [x] `"format:check": "prettier --check ."`
  - [x] `"lint:fix": "eslint . --fix"`

**Critério de aceite M0**

- [x] `pnpm dev` roda sem erros
- [x] `pnpm build` gera pasta `/dist`
- [x] Estrutura de pastas criada
- [x] `pnpm lint` passa sem erros
- [x] `pnpm format:check` passa sem erros
- [x] Pre-commit hook funcionando

---

## M1 — Tipos e Schemas (Base de Dados)

### Tipos TypeScript (obrigatório)

- [x] Criar `src/types/index.ts` com:
  - [x] `Channel` — `'google_ads' | 'meta_ads' | 'linkedin_ads'`
  - [x] `Tone` — 6 tons de voz disponíveis
  - [x] `Strategy` — 6 estratégias de persuasão
  - [x] `AppState` — `'idle' | 'generating' | 'reviewing' | 'exporting' | 'error'`
  - [x] `VariationStatus` — `'pending' | 'approved' | 'rejected'`
  - [x] `Briefing` interface
  - [x] `ChannelRules` interface
  - [x] `Variation` interface
  - [x] `GenerationConfig` interface
  - [x] `CHANNEL_RULES` const com limites de caracteres

### Schemas Zod (obrigatório)

- [x] Criar `src/schemas/briefing.ts` com:
  - [x] `briefingSchema` — validação do formulário de briefing
  - [x] `generationConfigSchema` — validação de canal/tom/quantidade
  - [x] Exportar tipos inferidos (`BriefingFormData`, `GenerationConfigData`)

### Regras de Canal (obrigatório)

- [x] Criar `src/lib/channelRules.ts` com limites:
  - [x] Google Ads: headline 30 chars, descrição 90 chars
  - [x] Meta Ads: headline 40 chars, descrição 125 chars
  - [x] LinkedIn Ads: headline 70 chars, descrição 150 chars

**Critério de aceite M1**

- [x] Tipos importáveis sem erros de TypeScript
- [x] Schemas validam dados corretamente

---

## M2 — Formulário de Briefing (Core Feature)

### Componentes UI necessários

- [x] Instalar componentes shadcn/ui:
  - [x] `button`
  - [x] `card`
  - [x] `input`
  - [x] `label`
  - [x] `textarea`
  - [x] `toast` / `sonner`

### BriefingForm (obrigatório)

- [x] Criar `src/components/briefing/BriefingForm.tsx` com campos:
  - [x] **Produto/Serviço** (textarea, obrigatório)
  - [x] **Público-alvo** (textarea, obrigatório)
  - [x] **Objetivo** (select: awareness, leads, conversão, remarketing, lançamento)
  - [x] **Diferenciais** (textarea, obrigatório)
  - [x] **Palavras-chave obrigatórias** (input, separadas por vírgula)
  - [x] **Palavras proibidas** (input, separadas por vírgula)
- [x] Validação inline com Zod (exibir erros nos campos)
- [x] Estado do formulário gerenciado com React Hook Form + zodResolver
- [x] Botão "Próximo" só habilitado quando form válido

### Layout da página

- [x] Criar layout responsivo (mobile-first)
- [x] Header com logo/nome "AdVariant"
- [x] Card contendo o formulário
- [x] Footer discreto (copyright)

**Critério de aceite M2**

- [x] Formulário valida todos os campos
- [x] Erros exibidos inline
- [x] Layout responsivo funciona em mobile

---

## M3 — Configuração de Canal e Tom

### Componentes UI necessários

- [x] Instalar componente shadcn/ui:
  - [x] `select`
  - [x] `radio-group` (opcional)

### ChannelSelector (obrigatório)

- [x] Criar `src/components/config/ChannelSelector.tsx`
- [x] Cards ou select para escolher canal:
  - [x] Google Ads (mostrar limites: 30/90 chars)
  - [x] Meta Ads (mostrar limites: 40/125 chars)
  - [x] LinkedIn Ads (mostrar limites: 70/150 chars)
- [x] Exibir preview dos limites ao selecionar

### ToneSelector (obrigatório)

- [x] Criar `src/components/config/ToneSelector.tsx`
- [x] Opções de tom de voz:
  - [x] Urgente / Escassez
  - [x] Inspiracional / Aspiracional
  - [x] Direto / Objetivo
  - [x] Emocional / Storytelling
  - [x] Humorístico / Descontraído
  - [x] Profissional / Técnico

### QuantitySelector (obrigatório)

- [x] Criar seletor de quantidade de variações:
  - [x] 5 variações
  - [x] 10 variações
  - [x] 15 variações
  - [x] 20 variações

### Integração

- [x] Combinar BriefingForm + Config em fluxo de steps
- [x] Navegação: Briefing → Config → Gerar

**Critério de aceite M3**

- [x] Seleção de canal funciona
- [x] Seleção de tom funciona
- [x] Seleção de quantidade funciona
- [x] Dados persistem entre steps

---

## M4 — Integração DeepSeek API (Geração com IA)

### Service de API

- [x] Criar `src/services/deepseek.ts`:
  - [x] Função `generateVariations(briefing, config)`
  - [x] Construir prompt conforme PRODUCT.md
  - [x] Usar `response_format: { type: 'json_object' }`
  - [x] Parsear resposta JSON
  - [x] Mapear variações com status `'pending'`

### Hook TanStack Query

- [x] Criar `src/hooks/useGenerateVariations.ts`:
  - [x] useMutation para chamada à API
  - [x] Tratamento de erro (onError)
  - [x] Estados: `isPending`, `isError`, `isSuccess`

### QueryClient

- [x] Criar `src/lib/queryClient.ts`:
  - [x] Configurar retry: 2
  - [x] Configurar staleTime: 5 minutos

### Estados da aplicação

- [x] Implementar state machine:
  - [x] `idle` → usuário preenchendo briefing
  - [x] `generating` → loading, chamada à API
  - [x] `reviewing` → variações geradas
  - [ ] `exporting` → gerando arquivo
  - [x] `error` → exibindo mensagem de erro

### UI de Loading

- [x] Criar loading state com Loader2 icon animado
- [x] Mensagem "Gerando variações..."
- [x] Desabilitar botões durante geração

**Critério de aceite M4**

- [x] API chamada corretamente com briefing + config
- [x] Variações retornadas e parseadas
- [x] Loading state visível durante geração
- [x] Erros tratados e exibidos

---

## M5 — Tela de Aprovação (Review)

### Componentes UI necessários

- [x] Instalar componentes shadcn/ui:
  - [x] `badge`
  - [x] `separator`

### CharCounter (obrigatório)

- [x] Criar `src/components/variations/CharCounter.tsx`:
  - [x] Exibir contagem atual vs limite
  - [x] Cor verde: dentro do limite
  - [x] Cor amarela: 90-100% do limite
  - [x] Cor vermelha: acima do limite

### VariationCard (obrigatório)

- [x] Criar `src/components/variations/VariationCard.tsx`:
  - [x] Exibir headline com CharCounter
  - [x] Exibir descrição com CharCounter
  - [x] Badge com estratégia de persuasão usada
  - [x] Botões de ação:
    - [x] Aprovar (Check icon, verde)
    - [x] Reprovar (X icon, vermelho)
    - [ ] Regenerar (RefreshCw icon) — movido para roadmap futuro
  - [x] Visual diferente para cada status (pending/approved/rejected)

### VariationGrid (obrigatório)

- [x] Criar `src/components/variations/VariationGrid.tsx`:
  - [x] Grid responsivo de cards (1 col mobile, 2 cols tablet, 3 cols desktop)
  - [x] Contador de aprovadas/reprovadas/pendentes
  - [x] Filtros por status (todas/pendentes/aprovadas/reprovadas)

### Ações de aprovação

- [x] Implementar toggle de status (pending → approved → rejected)
- [x] Atualizar contadores em tempo real
- [x] Persistir estado das variações

**Critério de aceite M5**

- [x] Cards exibem headline, descrição, estratégia
- [x] CharCounter funciona com cores corretas
- [x] Aprovar/reprovar altera status visual
- [x] Contador de aprovadas funciona

---

## M6 — Exportação

### Service de exportação

- [x] Criar `src/services/export.ts`:
  - [x] Função `exportToCSV(variations)` usando xlsx
  - [x] Filtrar apenas variações aprovadas
  - [x] Colunas: ID, Headline, Descrição, Estratégia
  - [x] Download automático do arquivo

### Funcionalidade "Copiar tudo"

- [x] Implementar cópia para clipboard
- [x] Formato estruturado (headline + descrição por linha)
- [x] Toast de confirmação "Copiado!"

### UI de exportação

- [x] Botão "Exportar CSV" (Download icon)
- [x] Botão "Copiar Aprovadas" (Copy icon)
- [x] Desabilitar se nenhuma aprovada
- [x] Mostrar quantidade de aprovadas no botão

**Critério de aceite M6**

- [x] CSV baixa corretamente com aprovadas
- [x] Cópia funciona e exibe toast
- [x] Botões desabilitados quando sem aprovadas

---

## M7 — Tratamento de Erros

### Cenários de erro (obrigatório)

- [x] **API key ausente:**
  - [x] ~~Modal solicitando chave antes de gerar~~ (removido — usa .env)
  - [x] ~~Input para colar a chave~~ (removido)
  - [x] ~~Salvar em localStorage~~ (removido — configurado via ambiente)
- [x] **API key inválida:**
  - [x] Toast com mensagem clara
  - [x] ~~Link/botão para reconfigurar (ícone na header)~~ (removido — configura via .env)
- [x] **Rate limit:**
  - [x] Mensagem explicando
  - [ ] Cooldown visual (countdown) — movido para M8
  - [x] Botão retry após cooldown
- [x] **Timeout:**
  - [x] Retry automático (até 2x via TanStack Query)
  - [x] Mensagem "Tentando novamente..."
  - [x] Botão retry manual após falhas
- [x] **JSON malformado:**
  - [x] Fallback: tentar parsear parcialmente
  - [x] Se falhar, botão "Regenerar"
- [x] **Erro de rede:**
  - [x] Detectar offline (NetworkError)
  - [x] Mensagem "Verifique sua conexão"
- [x] **Variação acima do limite:**
  - [x] Badge vermelho no card (CharCounter com cor)
  - [ ] Aviso antes de exportar — movido para M8

### Componente de erro

- [x] Criar componente `ErrorState` reutilizável
- [x] Ícone AlertCircle
- [x] Mensagem clara
- [x] Ação sugerida (botão)

**Critério de aceite M7**

- [x] Todos os cenários tratados
- [x] Mensagens claras e acionáveis
- [x] Retry funciona corretamente

---

## M8 — Polimento (UX + Performance)

### UX

- [ ] Animações sutis em transições (fade, slide)
- [ ] Feedback tátil (hover states, active states)
- [ ] Empty states com ilustração/mensagem
- [ ] Confirmação antes de limpar briefing

### Persistência local

- [ ] Criar `src/hooks/useLocalStorage.ts`
- [ ] Salvar último briefing no localStorage
- [ ] Opção "Continuar de onde parou"
- [ ] Histórico das últimas 5 gerações (opcional)

### Performance

- [ ] Lazy load de componentes pesados
- [ ] Otimizar re-renders com memo/useMemo
- [ ] Lighthouse Performance ≥ 90

### Acessibilidade

- [ ] Labels em todos os inputs
- [ ] Focus states visíveis
- [ ] Navegação por teclado (Tab/Enter)
- [ ] Contraste adequado (WCAG AA)
- [ ] aria-labels em botões de ícone

### SEO/Meta

- [ ] Title e description
- [ ] Open Graph tags
- [ ] Favicon

**Critério de aceite M8**

- [ ] UX fluida e responsiva
- [ ] Dados persistem entre sessões
- [ ] Lighthouse ≥ 90 em todas as métricas

---

## M9 — Deploy

### Preparação

- [ ] Build local funcionando
- [ ] Testar com API key real
- [ ] Verificar variáveis de ambiente

### Deploy Vercel/Netlify

- [ ] Conectar repositório
- [ ] Configurar variável `VITE_DEEPSEEK_API_KEY`
- [ ] Primeiro deploy
- [ ] Testar em produção

### Pós-deploy

- [ ] Verificar HTTPS
- [ ] Testar geração em produção
- [ ] Verificar CSP para `api.deepseek.com`

**Critério de aceite M9**

- [ ] App acessível publicamente
- [ ] Geração funciona em produção
- [ ] Performance aceitável

---

## M10 — Testes

### Setup do framework

- [ ] Instalar Vitest:
  - [ ] `vitest`
  - [ ] `@vitest/ui` (interface visual)
  - [ ] `jsdom` (simular DOM)
- [ ] Instalar React Testing Library:
  - [ ] `@testing-library/react`
  - [ ] `@testing-library/jest-dom`
  - [ ] `@testing-library/user-event`
- [ ] Criar `vitest.config.ts`:
  - [ ] Configurar `environment: 'jsdom'`
  - [ ] Configurar `globals: true`
  - [ ] Configurar `setupFiles`
- [ ] Criar `src/test/setup.ts` com matchers do jest-dom
- [ ] Adicionar scripts no package.json:
  - [ ] `"test": "vitest"`
  - [ ] `"test:ui": "vitest --ui"`
  - [ ] `"test:run": "vitest run"`
  - [ ] `"test:coverage": "vitest --coverage"`

### Testes unitários (obrigatório)

- [ ] Testar schemas Zod:
  - [ ] `briefingSchema` — validações corretas/incorretas
  - [ ] `generationConfigSchema` — canais e tons válidos
- [ ] Testar `src/lib/channelRules.ts`:
  - [ ] Limites de caracteres por canal
- [ ] Testar `src/services/export.ts`:
  - [ ] Geração de CSV com dados corretos
  - [ ] Filtro de variações aprovadas

### Testes de componentes (obrigatório)

- [ ] Testar `BriefingForm.tsx`:
  - [ ] Renderiza todos os campos
  - [ ] Validação exibe erros inline
  - [ ] Submit só habilitado quando válido
- [ ] Testar `ChannelSelector.tsx`:
  - [ ] Seleção altera estado
  - [ ] Exibe limites corretos
- [ ] Testar `VariationCard.tsx`:
  - [ ] Aprovar muda status para 'approved'
  - [ ] Reprovar muda status para 'rejected'
  - [ ] Badge exibe estratégia correta
- [ ] Testar `CharCounter.tsx`:
  - [ ] Verde quando < 90% do limite
  - [ ] Amarelo quando 90-100%
  - [ ] Vermelho quando > 100%

### Testes de integração (opcional MVP)

- [ ] Testar fluxo briefing → config → mock de geração
- [ ] Testar exportação de variações aprovadas

**Critério de aceite M10**

- [ ] `pnpm test:run` passa sem falhas
- [ ] Coverage ≥ 70% em schemas e utils
- [ ] Componentes core testados

---

## Roadmap Futuro (Pós-MVP)

> Funcionalidades para versões futuras, não incluídas no MVP.

| Funcionalidade                | Descrição                                                 | Prioridade |
| ----------------------------- | --------------------------------------------------------- | ---------- |
| **Preview visual**            | Simular como a copy fica em post Instagram ou card Google | Alta       |
| **Histórico de sessão**       | Manter últimas gerações no localStorage                   | Alta       |
| **Regeneração com instrução** | "Torna mais urgente" / "Remove emoji" por variação        | Média      |
| **Multi-canal simultâneo**    | Gerar para 2+ canais ao mesmo tempo                       | Média      |
| **Score da copy**             | IA avalia e pontua cada variação                          | Baixa      |
| **Templates de briefing**     | Briefings pré-configurados por nicho                      | Baixa      |

---

## Status Atual (log)

> **A IA deve atualizar esta seção SEMPRE que marcar checkboxes.**
> Adicione uma nova entrada no topo (mais recente primeiro).

### [2026-03-28] — Sessão 4 (Redesign UI/UX Completo)

**Concluído:**

- [x] **Fase 1: Design Tokens e Sistema de Cores (`index.css`)**
  - Adicionado tokens para Warning (`--color-warning`, `--color-warning-muted`)
  - Adicionado tokens para Info (`--color-info`, `--color-info-muted`)
  - Adicionado tokens para Glassmorphism (`--color-glass`, `--color-glass-border`, `--color-glass-highlight`)
  - Adicionado token `--color-placeholder` para placeholders mais visíveis
  - Melhorado contraste de `--color-border` e `--color-input`
  - Criado classes `.glass` e `.glass-card` com backdrop blur
  - Criado animações: `.animate-in`, `.hover-lift`, `.press-scale`
  - Criado `.gradient-border-selected` para estados de seleção
  - Criado `.pulse-ring` para step ativo

- [x] **Fase 2: Componentes UI Base**
  - `input.tsx`: Adicionado props `icon` e `error`, melhorado cores e placeholder
  - `textarea.tsx`: Adicionado props `icon` e `error`, melhorado cores e placeholder
  - `form-field.tsx`: NOVO componente wrapper consistente com label, erro e hint
  - `card.tsx`: Adicionado `variant="glass"` usando cva
  - `badge.tsx`: Adicionado variantes `success`, `success-muted`, `warning`, `warning-muted`, `info`, `info-muted`
  - `button.tsx`: Adicionado variantes `gradient` e `success`, classe `press-scale`

- [x] **Fase 3: BriefingForm**
  - Convertido para Card glass
  - Adicionado ícones em todos os campos (Package, Users, Target, Sparkles, Tag, Ban)
  - Usando FormField wrapper para estrutura consistente
  - Botão com `variant="gradient"`

- [x] **Fase 4: Config Components**
  - `ConfigStep.tsx`: Card glass com espaçamento melhorado
  - `ChannelSelector.tsx`: Gradient border on selection, hover-lift, ícones coloridos por marca
  - `ToneSelector.tsx`: Gradient border, containers de ícone com cores baseadas em estado
  - `QuantitySelector.tsx`: Refatorado de buttons para cards com descrições

- [x] **Fase 5: Variation Components**
  - `CharCounter.tsx`: Cores semânticas (success/warning/destructive) - sem hardcoded
  - `VariationCard.tsx`: Variant glass, gradient border quando aprovado, animações
  - `VariationGrid.tsx`: Filtros como pills/chips com badges coloridos

- [x] **Fase 6: StepIndicator (App.tsx)**
  - Redesign completo com gradientes para steps completos
  - Animação pulse para step ativo
  - Ícone Check quando completo
  - Linha conectora com gradiente quando step concluído
  - Labels sempre visíveis

- [x] **Fase 7: Toasts (`sonner.tsx`)**
  - Tema dark com glassmorphism
  - Bordas semânticas para diferentes tipos de toast

- [x] **Melhorias Adicionais**
  - Header com glass e logo gradiente
  - Background glow no container principal
  - Uso consistente de `.animate-in` para transições de página
  - Todas cores hardcoded substituídas por tokens semânticos

**Build:** `pnpm build` passou sem erros

**Próximos passos:**

- [ ] Testar visualmente todos os estados (erro, loading, sucesso)
- [ ] Verificar responsividade mobile
- [ ] M8 — Polimento (UX + Performance) restante
- [ ] M9 — Deploy

---

### [2026-03-28] — Sessão 3 (Refatoração)

**Concluído:**

- [x] **Remoção do Modal de API Key**
  - Deletado `src/components/config/ApiKeyModal.tsx`
  - Deletado `src/lib/apiKeyStorage.ts`
  - Simplificado `deepseek.ts` para usar apenas `VITE_DEEPSEEK_API_KEY` do `.env`
  - Removido botão de chave do header e estados relacionados em `App.tsx`
  - API key agora é configurada apenas pelo proprietário via ambiente

- [x] **Migração para React Hook Form**
  - Instalado `react-hook-form` e `@hookform/resolvers`
  - Migrado `BriefingForm.tsx` de useState manual para `useForm` com `zodResolver`
  - Migrado `ConfigStep.tsx` para usar Controllers com React Hook Form
  - Atualizado schema Zod para compatibilidade com RHF (removido `.default([])`)

- [x] **Melhorias de UI — Cores Semânticas**
  - Adicionado tokens de cor `--color-success`, `--color-success-foreground`, `--color-success-muted` em `index.css`
  - Adicionado classe `.badge-success` nos componentes CSS
  - Atualizado `VariationCard.tsx` para usar `bg-success` ao invés de `bg-green-600`
  - Atualizado `VariationGrid.tsx` para usar cores semânticas nos filtros

- [x] **Correção de Segurança**
  - Removido `.env` do tracking do Git
  - Adicionado `.env` ao `.gitignore`
  - Removido `.env` do histórico do Git com `filter-branch`

**Pendente:**

- [ ] M8 — Polimento (UX + Performance)
- [ ] M9 — Deploy
- [ ] M10 — Testes

**Próximos passos imediatos:**

- [ ] Rotacionar API key do DeepSeek (foi exposta)
- [ ] Deploy em Vercel com variável de ambiente
- [ ] Adicionar animações sutis

---

### [2026-03-28] — Sessão 2

**Concluído:**

- [x] M5 completo — Tela de Aprovação
  - Criado CharCounter.tsx com cores verde/amarelo/vermelho
  - Extraído VariationCard.tsx para arquivo próprio com CharCounter
  - Criado VariationGrid.tsx com filtros por status
  - Integrado limites de caracteres do canal selecionado
- [x] M6 completo — Exportação
  - exportToCSV e copyApprovedToClipboard funcionando
  - Botões com contagem de aprovadas
  - Toasts de confirmação
- [x] M7 completo — Tratamento de Erros
  - Criado ApiKeyModal.tsx com validação e localStorage
  - Criado error-state.tsx reutilizável
  - Adicionado ícone de chave no header (verde quando configurada)
  - Classes de erro específicas (ApiKeyMissingError, ApiKeyInvalidError, RateLimitError, NetworkError)
  - Tratamento de erros no App.tsx com toasts e redirecionamentos
  - Dialog shadcn/ui instalado

**Pendente:**

- [ ] M8 — Polimento (UX + Performance)
- [ ] M9 — Deploy
- [ ] M10 — Testes

**Próximos passos imediatos:**

- [ ] Adicionar animações sutis em transições
- [ ] Implementar persistência do briefing em localStorage
- [ ] Testar deploy em Vercel

---

### [2026-03-28] — Sessão 1

**Concluído:**

- [x] M0 completo — Setup & Deploy (Fundação)
  - Instaladas dependências: @tanstack/react-query, zod, xlsx
  - Criada estrutura de pastas conforme STACK.md
  - Configurado QueryClientProvider no main.tsx
  - Instalado e configurado Prettier + ESLint integration
  - Configurado Husky + lint-staged para pre-commit hooks
  - Adicionados scripts: format, format:check, lint:fix
  - Build passando sem erros
- [x] M1 completo — Tipos e Schemas
  - Criado src/types/index.ts com todos os tipos
  - Criado src/schemas/briefing.ts com schemas Zod 4
  - Criado src/lib/channelRules.ts com regras de canais
- [x] M2 completo — Formulário de Briefing
  - Instalados componentes: select, sonner
  - Criado BriefingForm.tsx com validação Zod inline
  - Layout responsivo com Header, Main, Footer
  - Toaster configurado para notificações
- [x] M3 completo — Configuração de Canal e Tom
  - Criado ChannelSelector.tsx com cards visuais
  - Criado ToneSelector.tsx com 6 opções + ícones
  - Criado QuantitySelector.tsx (5, 10, 15, 20)
  - Criado ConfigStep.tsx combinando seletores
  - Fluxo de steps integrado no App.tsx
  - Indicador de progresso visual adicionado
- [x] M4 completo — Integração DeepSeek API
  - Criado .env com VITE_DEEPSEEK_API_KEY
  - Criado src/services/deepseek.ts com chamada à API
  - Criado src/hooks/useGenerateVariations.ts com useMutation
  - Loading state com Loader2 animado
  - Tratamento de erros (API key, rate limit, timeout)
  - Toast de sucesso/erro
- [x] M5 parcialmente completo — Tela de Aprovação
  - VariationCard com approve/reject implementado
  - Grid responsivo de variações
  - Contadores de aprovadas/reprovadas/pendentes
  - Status visual diferente para cada estado

**Pendente:**

- [ ] M5 — CharCounter com cores (verde/amarelo/vermelho)
- [ ] M6 — Exportação CSV + Copiar aprovadas
- [ ] M7 — Tratamento de Erros avançado
- [ ] M8 — Polimento (UX + Performance)

**Próximos passos imediatos:**

- [ ] Criar CharCounter.tsx com indicador visual
- [ ] Criar src/services/export.ts para CSV
- [ ] Adicionar botões de exportação na tela de review

---
