import { AICache, CacheOptions } from './cache';
import { RateLimiter, RateLimiterOptions } from './rate-limiter';
import { RequestBatcher, BatcherOptions, BatchProcessorFn } from './batcher';
import { AIProvider, CompletionOptions, CompletionResponse } from './providers/base-provider';
import { OpenAIProvider, OpenAIOptions } from './providers/openai-provider';
import { AnthropicProvider, AnthropicOptions } from './providers/anthropic-provider';
import { DeepSeekProvider, DeepSeekOptions } from './providers/deepseek-provider';
import { PerplexityProvider, PerplexityOptions } from './providers/perplexity-provider';

/**
 * Supported AI provider types
 */
export type ProviderType = 'openai' | 'anthropic' | 'deepseek' | 'perplexity' | 'custom';

/**
 * Options for the efficiency client
 */
export interface ClientOptions {
  /**
   * Provider type to use
   * @default 'openai'
   */
  provider?: ProviderType;
  
  /**
   * Provider-specific options (API keys, etc)
   */
  providerOptions: any;
  
  /**
   * Custom provider implementation
   */
  customProvider?: AIProvider;
  
  /**
   * Cache options
   */
  cacheOptions?: CacheOptions;
  
  /**
   * Rate limiter options
   */
  rateLimiterOptions?: RateLimiterOptions;
  
  /**
   * Batcher options
   */
  batcherOptions?: Omit<BatcherOptions, 'processBatchFn'>;
  
  /**
   * Whether to enable request caching
   * @default true
   */
  enableCache?: boolean;
  
  /**
   * Whether to enable rate limiting
   * @default true
   */
  enableRateLimiting?: boolean;
  
  /**
   * Whether to enable request batching
   * @default true
   */
  enableBatching?: boolean;
}

/**
 * Main client for interacting with AI APIs efficiently
 */
export class EfrateClient {
  private provider: AIProvider;
  private cache: AICache;
  private rateLimiter: RateLimiter;
  private batcher: RequestBatcher;
  
  private enableCache: boolean;
  private enableRateLimiting: boolean;
  private enableBatching: boolean;

  /**
   * Creates a new Efrate client
   * @param options Configuration options
   */
  constructor(options: ClientOptions) {
    // Initialize provider
    this.provider = this.createProvider(options.provider || 'openai', options.providerOptions, options.customProvider);
    
    // Initialize cache
    this.enableCache = options.enableCache !== undefined ? options.enableCache : true;
    this.cache = new AICache(options.cacheOptions);
    
    // Initialize rate limiter
    this.enableRateLimiting = options.enableRateLimiting !== undefined ? options.enableRateLimiting : true;
    this.rateLimiter = new RateLimiter(options.rateLimiterOptions || {
      tokensPerInterval: 60,
      intervalInMs: 60000
    });
    
    // Initialize batcher with a processor function that calls the provider
    const processBatchFn: BatchProcessorFn = async (prompts, optionsArray) => {
      return Promise.all(prompts.map((prompt, index) => 
        this.provider.complete(prompt, optionsArray[index])
      ));
    };
    
    this.enableBatching = options.enableBatching !== undefined ? options.enableBatching : true;
    this.batcher = new RequestBatcher({
      ...(options.batcherOptions || {}),
      processBatchFn
    });
  }

  /**
   * Creates a provider instance based on the specified type
   */
  private createProvider(
    type: ProviderType, 
    options: any, 
    customProvider?: AIProvider
  ): AIProvider {
    if (type === 'custom' && customProvider) {
      return customProvider;
    }
    
    switch (type) {
      case 'openai':
        return new OpenAIProvider(options as OpenAIOptions);
      case 'anthropic':
        return new AnthropicProvider(options as AnthropicOptions);
      case 'deepseek':
        return new DeepSeekProvider(options as DeepSeekOptions);
      case 'perplexity':
        return new PerplexityProvider(options as PerplexityOptions);
      default:
        throw new Error(`Unsupported provider type: ${type}`);
    }
  }

  /**
   * Makes a completion request with all efficiency optimizations
   * @param prompt Text prompt to complete
   * @param options Options for the completion request
   * @returns Completion response
   */
  async complete(
    prompt: string,
    options: CompletionOptions = { model: 'gpt-3.5-turbo' }
  ): Promise<CompletionResponse> {
    // Check cache first
    if (this.enableCache) {
      const cachedResponse = this.cache.get(prompt);
      if (cachedResponse) {
        return cachedResponse as CompletionResponse;
      }
    }
    
    // Respect rate limits
    if (this.enableRateLimiting) {
      const canProceed = await this.rateLimiter.acquireToken();
      if (!canProceed) {
        throw new Error('Rate limit exceeded and maximum wait time reached');
      }
    }
    
    let response: CompletionResponse;
    
    // Use batching if enabled, otherwise call provider directly
    if (this.enableBatching) {
      response = await this.batcher.addRequest(prompt, options);
    } else {
      response = await this.provider.complete(prompt, options);
    }
    
    // Cache the result
    if (this.enableCache) {
      this.cache.set(prompt, response);
    }
    
    return response;
  }

  /**
   * Makes a chat completion request with all efficiency optimizations
   * @param messages Array of conversation messages
   * @param options Options for the chat completion request
   * @returns Chat completion response
   */
  async chat(
    messages: any[],
    options: CompletionOptions = { model: 'gpt-3.5-turbo' }
  ): Promise<CompletionResponse> {
    // For chat completions, we can't use the regular cache or batcher
    // since the messages array is more complex
    // Only apply rate limiting
    
    if (this.enableRateLimiting) {
      const canProceed = await this.rateLimiter.acquireToken();
      if (!canProceed) {
        throw new Error('Rate limit exceeded and maximum wait time reached');
      }
    }
    
    return await this.provider.chat(messages, options);
  }

  /**
   * Generates embeddings for text
   * @param input Text or array of texts
   * @param options Embedding options
   * @returns Vector embeddings
   */
  async embeddings(
    input: string | string[],
    options: any = {}
  ): Promise<number[][] | number[]> {
    if (this.enableRateLimiting) {
      const canProceed = await this.rateLimiter.acquireToken();
      if (!canProceed) {
        throw new Error('Rate limit exceeded and maximum wait time reached');
      }
    }
    
    return await this.provider.embeddings(input, options);
  }

  /**
   * Clears the response cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Purges expired entries from the cache
   * @returns Number of entries purged
   */
  purgeExpiredCache(): number {
    return this.cache.purgeExpired();
  }
} 