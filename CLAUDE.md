# AdVariant — Instruções para Claude

Este projeto é o **AdVariant**, um gerador de variações de copy para anúncios digitais.

## Documentação Obrigatória

Antes de desenvolver qualquer funcionalidade, leia:

1. **[PRODUCT.md](./PRODUCT.md)** — Regras de negócio, funcionalidades, estados da aplicação
2. **[STACK.md](./STACK.md)** — Stack técnica, padrões de código, estrutura de pastas

## Stack Resumida

| Categoria     | Tecnologia                   |
| ------------- | ---------------------------- |
| Framework     | React 18 + Vite + TypeScript |
| Estilização   | Tailwind CSS                 |
| Componentes   | shadcn/ui                    |
| Ícones        | Lucide Icons                 |
| Data Fetching | TanStack Query               |
| Validação     | Zod                          |
| IA            | DeepSeek API                 |

## Regras de Desenvolvimento

- Sempre use componentes do shadcn/ui (não crie do zero)
- Sempre use ícones do Lucide (não use outros pacotes)
- Use TanStack Query para chamadas à API
- Valide formulários com Zod
- Siga a estrutura de pastas definida em STACK.md
- Path alias: `@/` aponta para `./src/`

## Milestones (OBRIGATÓRIO)

**Ao final de cada sessão de trabalho, SEMPRE atualize o arquivo `milestones.md`:**

1. Marque os checkboxes `[x]` das tarefas concluídas
2. Adicione uma nova entrada no "Status Atual (log)" com:
   - Data da sessão
   - O que foi concluído
   - O que ficou pendente
   - Próximos passos imediatos
3. NUNCA apague o histórico — apenas adicione novas entradas no topo

## Fluxo do App

```
Briefing → Configuração → Geração com IA → Aprovação → Exportação
```

## Canais Suportados

- Google Ads (headline: 30 chars, descrição: 90 chars)
- Meta Ads (headline: 40 chars, descrição: 125 chars)
- LinkedIn Ads (headline: 70 chars, descrição: 150 chars)
