import type { Strategy } from '@/types'

export const STRATEGY_LABELS: Record<Strategy, string> = {
  social_proof: 'Prova Social',
  direct_benefit: 'Benefício Direto',
  scarcity: 'Escassez',
  provocative_question: 'Pergunta Provocativa',
  authority: 'Autoridade',
  transformation: 'Transformação',
}

export function getStrategyLabel(strategy: Strategy): string {
  return STRATEGY_LABELS[strategy] || strategy
}
