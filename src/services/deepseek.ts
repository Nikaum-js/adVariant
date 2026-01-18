import type { Briefing, GenerationConfig, Variation, Strategy } from '@/types'
import { CHANNEL_RULES } from '@/lib/channelRules'

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

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

export class ApiKeyMissingError extends Error {
  constructor() {
    super('API key não configurada. Adicione VITE_DEEPSEEK_API_KEY no arquivo .env')
    this.name = 'ApiKeyMissingError'
  }
}

export class ApiKeyInvalidError extends Error {
  constructor() {
    super('API key inválida. Verifique sua chave DeepSeek.')
    this.name = 'ApiKeyInvalidError'
  }
}

export class RateLimitError extends Error {
  constructor() {
    super('Rate limit atingido. Aguarde alguns segundos e tente novamente.')
    this.name = 'RateLimitError'
  }
}

export class NetworkError extends Error {
  constructor() {
    super('Erro de conexão. Verifique sua internet e tente novamente.')
    this.name = 'NetworkError'
  }
}

export function getApiKey(): string | null {
  return import.meta.env.VITE_DEEPSEEK_API_KEY || null
}

export async function generateVariations(
  briefing: Briefing,
  config: GenerationConfig
): Promise<Variation[]> {
  const apiKey = getApiKey()

  if (!apiKey) {
    throw new ApiKeyMissingError()
  }

  const channelRules = CHANNEL_RULES[config.channel]
  const prompt = buildPrompt(briefing, config, channelRules)

  let response: Response

  try {
    response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content:
              'Você é um especialista em copywriting para anúncios digitais. Sempre responda em JSON válido.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
        response_format: { type: 'json_object' },
      }),
    })
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new NetworkError()
    }
    throw error
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    if (response.status === 401) {
      throw new ApiKeyInvalidError()
    }
    if (response.status === 429) {
      throw new RateLimitError()
    }
    throw new Error(
      `Erro na API: ${response.status} - ${errorData.error?.message || 'Erro desconhecido'}`
    )
  }

  const data: DeepSeekResponse = await response.json()
  const content = data.choices[0]?.message?.content

  if (!content) {
    throw new Error('Resposta vazia da API')
  }

  try {
    const parsed = JSON.parse(content)
    const variations: ParsedVariation[] = parsed.variations || parsed.variacoes || []

    return variations.map((v) => ({
      id: v.id,
      headline: v.headline,
      description: v.description,
      strategy: v.strategy,
      charCount: {
        headline: v.headline.length,
        description: v.description.length,
      },
      status: 'pending' as const,
    }))
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

  return `
Gere ${config.quantity} variações de copy para ${channelRules.name}.

## BRIEFING
- **Produto/Serviço:** ${briefing.product}
- **Público-alvo:** ${briefing.targetAudience}
- **Objetivo:** ${briefing.objective}
- **Diferenciais:** ${briefing.differentials}

## REGRAS DO CANAL
- Headline: MÁXIMO ${channelRules.headlineLimit} caracteres (OBRIGATÓRIO)
- Descrição: MÁXIMO ${channelRules.descriptionLimit} caracteres (OBRIGATÓRIO)

## RESTRIÇÕES
- Palavras obrigatórias: ${requiredKeywords}
- Palavras proibidas: ${forbiddenWords}

## TOM DE VOZ
${getToneDescription(config.tone)}

## ESTRATÉGIAS DE PERSUASÃO (use uma diferente para cada variação)
- social_proof: Prova social, números, depoimentos
- direct_benefit: Benefício direto e claro
- scarcity: Escassez e urgência
- provocative_question: Pergunta provocativa
- authority: Autoridade e credibilidade
- transformation: Transformação antes/depois

## INSTRUÇÕES IMPORTANTES
1. Cada variação DEVE usar uma estratégia diferente
2. NUNCA ultrapasse os limites de caracteres
3. Conte os caracteres com precisão
4. Inclua a estratégia usada em cada variação

Responda APENAS com JSON válido no formato:
{
  "variations": [
    {
      "id": 1,
      "headline": "Texto do headline aqui",
      "description": "Texto da descrição aqui",
      "strategy": "scarcity",
      "charCount": { "headline": 25, "description": 87 }
    }
  ]
}
`
}
