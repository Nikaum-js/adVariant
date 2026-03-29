import { QueryClient, type DefaultOptions } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { RateLimitError, NetworkError } from './axios'

// Determine if an error is retryable
function shouldRetry(error: unknown): boolean {
  // Don't retry on client errors (4xx) except rate limits
  if (error instanceof AxiosError && error.response) {
    const status = error.response.status
    // Retry on server errors (5xx) and rate limits
    if (status >= 500 || status === 429) {
      return true
    }
    // Don't retry on other client errors
    return false
  }

  // Retry on network errors
  if (error instanceof NetworkError) {
    return true
  }

  // Retry on rate limit errors
  if (error instanceof RateLimitError) {
    return true
  }

  // Default: retry on unknown errors
  return true
}

const queryConfig: DefaultOptions = {
  queries: {
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
    retry: (failureCount, error) => {
      if (failureCount >= 2) return false
      return shouldRetry(error)
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    refetchOnWindowFocus: false,
  },
  mutations: {
    retry: (failureCount, error) => {
      if (failureCount >= 2) return false
      return shouldRetry(error)
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  },
}

export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
})
