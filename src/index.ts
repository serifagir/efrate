// Core client
export { EfrateClient } from './client';
export type { ClientOptions, ProviderType } from './client';

// Cache
export { AICache } from './cache';
export type { CacheOptions, CacheEntry } from './cache';

// Rate limiting
export { RateLimiter } from './rate-limiter';
export type { RateLimiterOptions } from './rate-limiter';

// Batching
export { RequestBatcher } from './batcher';
export type { BatcherOptions, BatchProcessorFn } from './batcher';

// Providers
export { OpenAIProvider } from './providers/openai-provider';
export { AnthropicProvider } from './providers/anthropic-provider';
export { DeepSeekProvider } from './providers/deepseek-provider';
export { PerplexityProvider } from './providers/perplexity-provider';

export type { OpenAIOptions } from './providers/openai-provider';
export type { AnthropicOptions } from './providers/anthropic-provider';
export type { DeepSeekOptions } from './providers/deepseek-provider';
export type { PerplexityOptions } from './providers/perplexity-provider';

// Provider interfaces
export type {
  AIProvider,
  ProviderOptions,
  CompletionOptions,
  CompletionResponse
} from './providers/base-provider';

// Utils
export { TokenBucket } from './utils/token-bucket';
export {
  calculateSimilarity,
  levenshteinDistance,
  normalizePrompt
} from './utils/similarity'; 