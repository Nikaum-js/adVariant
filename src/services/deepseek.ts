import type { Briefing, GenerationConfig, Variation, Strategy } from '@/types'
import { CHANNEL_RULES } from '@/lib/channelRules'
import { deepseekApi } from '@/lib/axios'

// Re-export error classes for backward compatibility
export {
  ApiKeyMissingError,
  ApiKeyInvalidError,
  RateLimitError,
  NetworkError,
  getApiKey,
} from '@/lib/axios'

interface DeepSeekResponse {
  choices: {
    message: {
      content: string
    }
  }[]
}

interface ParsedVariation {
  id: number
  headline: string
  description: string
  strategy: Strategy
  charCount: {
    headline: number
    description: number
  }
}

export async function generateVariations(
  briefing: Briefing,
  config: GenerationConfig
): Promise<Variation[]> {
  const channelRules = CHANNEL_RULES[config.channel]
  const prompt = buildPrompt(briefing, config, channelRules)

  const { data } = await deepseekApi.post<DeepSeekResponse>('/chat/completions', {
    model: 'deepseek-chat',
    messages: [
      {
        role: 'system',
        content:
          'Você é um copywriter especialista em anúncios digitais. REGRA CRÍTICA: NUNCA exceda os limites de caracteres - textos acima do limite são AUTOMATICAMENTE REJEITADOS e desperdiçam o trabalho. Conte os caracteres ANTES de responder. Sempre responda em JSON válido.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.8,
    response_format: { type: 'json_object' },
  })

  const content = data.choices[0]?.message?.content

  if (!content) {
    throw new Error('Resposta vazia da API')
  }

  try {
    const parsed = JSON.parse(content)
    const variations: ParsedVariation[] = parsed.variations || parsed.variacoes || []

    return variations.map((v) => {
      const headlineLength = v.headline.length
      const descriptionLength = v.description.length
      const isOverLimit =
        headlineLength > channelRules.headlineLimit ||
        descriptionLength > channelRules.descriptionLimit

      return {
        id: v.id,
        headline: v.headline,
        description: v.description,
        strategy: v.strategy,
        charCount: {
          headline: headlineLength,
          description: descriptionLength,
        },
        status: isOverLimit ? ('rejected' as const) : ('pending' as const),
      }
    })
  } catch {
    throw new Error('Erro ao processar resposta da API. Tente novamente.')
  }
}

function getToneDescription(tone: string): string {
  const tones: Record<string, string> = {
    urgent:
      'Urgente e com senso de escassez. Use palavras como "agora", "últimas vagas", "não perca".',
    inspirational: 'Inspiracional e aspiracional. Conecte com sonhos e objetivos do público.',
    direct: 'Direto e objetivo. Vá direto ao ponto sem rodeios.',
    emotional: 'Emocional e storytelling. Conecte através de histórias e emoções.',
    humorous: 'Humorístico e descontraído. Leve e divertido.',
    professional: 'Profissional e técnico. Sério, confiável, com foco em dados.',
  }
  return tones[tone] || tone
}

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

/**
 * Gera exemplos few-shot calibrados por canal
 * Exemplos usam ~70% do limite para mostrar o tamanho esperado
 */
function generateFewShotExamples(headlineLimit: number): string {
  let examples: { headline: string; description: string }[]

  if (headlineLimit <= 30) {
    // Google Ads - exemplos curtos
    examples = [
      {
        headline: 'Economize 50% hoje',
        description: 'Oferta por tempo limitado. Aproveite agora e garanta seu desconto exclusivo.',
      },
      {
        headline: 'Frete grátis Brasil',
        description: 'Compre online e receba em casa sem custo adicional. Entrega rápida.',
      },
    ]
  } else if (headlineLimit <= 45) {
    // Meta Ads - exemplos médios
    examples = [
      {
        headline: 'Descubra como economizar 50% hoje',
        description:
          'Milhares já aproveitaram nossa oferta especial. Não perca essa oportunidade única de transformar sua vida.',
      },
      {
        headline: 'Transforme sua rotina em apenas 7 dias',
        description:
          'Programa completo para você alcançar seus objetivos. Comece sua jornada de sucesso agora mesmo.',
      },
    ]
  } else {
    // LinkedIn Ads - exemplos mais longos
    examples = [
      {
        headline: 'Descubra como profissionais de sucesso alcançam resultados extraordinários',
        description:
          'Mais de 10.000 executivos já transformaram suas carreiras com nossa metodologia exclusiva. Junte-se a eles e acelere seu crescimento.',
      },
      {
        headline: 'A solução completa que sua empresa precisa para crescer em 2024',
        description:
          'Ferramenta completa para gestão de equipes e projetos. Aumente a produtividade do seu time em até 40% com nosso método comprovado.',
      },
    ]
  }

  return examples
    .map(
      (ex, i) =>
        `${i + 1}. Headline: "${ex.headline}" (${ex.headline.length} chars) | Descrição: "${ex.description}" (${ex.description.length} chars)`
    )
    .join('\n')
}

function buildPrompt(
  briefing: Briefing,
  config: GenerationConfig,
  channelRules: { name: string; headlineLimit: number; descriptionLimit: number }
): string {
  const requiredKeywords =
    briefing.requiredKeywords.length > 0
      ? briefing.requiredKeywords.join(', ')
      : 'nenhuma especificada'

  const forbiddenWords =
    briefing.forbiddenWords.length > 0 ? briefing.forbiddenWords.join(', ') : 'nenhuma especificada'

  // Usa limite efetivo com margem proporcional ao tamanho do limite
  const effectiveHeadlineLimit = getEffectiveLimit(channelRules.headlineLimit)
  const effectiveDescLimit = getEffectiveLimit(channelRules.descriptionLimit)

  const fewShotExamples = generateFewShotExamples(channelRules.headlineLimit)

  return `
Gere ${config.quantity} variações de copy para ${channelRules.name}.

## ⚠️ LIMITES OBRIGATÓRIOS - SERÃO REJEITADOS SE EXCEDER
- Headline: MÁXIMO ${effectiveHeadlineLimit} caracteres (CONTE ANTES DE ESCREVER)
- Descrição: MÁXIMO ${effectiveDescLimit} caracteres (CONTE ANTES DE ESCREVER)

ATENÇÃO: Qualquer texto acima desses limites será AUTOMATICAMENTE DESCARTADO.
Verifique a contagem de CADA variação antes de incluir no JSON.

## EXEMPLOS DE TAMANHO CORRETO
${fewShotExamples}

Seus textos devem ter tamanho SIMILAR aos exemplos acima.
Utilize bem o espaço disponível, mas NUNCA ultrapasse os limites.

## BRIEFING
- Produto: ${briefing.product}
- Público: ${briefing.targetAudience}
- Objetivo: ${briefing.objective}
- Diferenciais: ${briefing.differentials}

## RESTRIÇÕES
- Palavras obrigatórias: ${requiredKeywords}
- Palavras proibidas: ${forbiddenWords}

## TOM
${getToneDescription(config.tone)}

## ESTRATÉGIAS (use uma diferente por variação)
- social_proof: Prova social
- direct_benefit: Benefício direto
- scarcity: Escassez/urgência
- provocative_question: Pergunta provocativa
- authority: Autoridade
- transformation: Transformação

Responda APENAS com JSON:
{
  "variations": [
    {
      "id": 1,
      "headline": "Texto curto",
      "description": "Descrição curta",
      "strategy": "scarcity"
    }
  ]
}
`
}
