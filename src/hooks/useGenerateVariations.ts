import { useMutation } from '@tanstack/react-query'
import { generateVariations } from '@/services/deepseek'
import type { Briefing, GenerationConfig, Variation } from '@/types'

interface GenerateParams {
  briefing: Briefing
  config: GenerationConfig
}

export function useGenerateVariations() {
  return useMutation({
    mutationFn: ({ briefing, config }: GenerateParams): Promise<Variation[]> =>
      generateVariations(briefing, config),
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  })
}
