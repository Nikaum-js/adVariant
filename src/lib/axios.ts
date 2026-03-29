import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'

// Custom error classes
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
  constructor(message?: string) {
    super(message || 'Erro de conexão. Verifique sua internet e tente novamente.')
    this.name = 'NetworkError'
  }
}

// Get API key from environment
export function getApiKey(): string | null {
  return import.meta.env.VITE_DEEPSEEK_API_KEY || null
}

// DeepSeek API instance
export const deepseekApi = axios.create({
  baseURL: 'https://api.deepseek.com/v1',
  timeout: 60000, // 60 seconds for AI responses
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add auth token
deepseekApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const apiKey = getApiKey()

    if (!apiKey) {
      throw new ApiKeyMissingError()
    }

    config.headers.Authorization = `Bearer ${apiKey}`
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle errors
deepseekApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error?: { message?: string } }>) => {
    // Network error (no response)
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        throw new NetworkError('Timeout: a requisição demorou muito. Tente novamente.')
      }
      throw new NetworkError()
    }

    const { status, data } = error.response

    switch (status) {
      case 401:
        throw new ApiKeyInvalidError()
      case 429:
        throw new RateLimitError()
      case 500:
      case 502:
      case 503:
        throw new Error('Servidor temporariamente indisponível. Tente novamente em alguns minutos.')
      default:
        throw new Error(`Erro na API: ${status} - ${data?.error?.message || 'Erro desconhecido'}`)
    }
  }
)

// Generic API instance (for future APIs)
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Generic error handler for api instance
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (!error.response) {
      throw new NetworkError()
    }

    const { status, data } = error.response
    throw new Error(data?.message || `Erro: ${status}`)
  }
)
