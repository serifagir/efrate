/**
 * Base interface for AI provider options
 */
export interface ProviderOptions {
  /**
   * API key for the provider
   */
  apiKey: string;
  
  /**
   * Base URL for API requests (optional for overriding defaults)
   */
  baseUrl?: string;
  
  /**
   * Additional HTTP headers to include in requests
   */
  headers?: Record<string, string>;
  
  /**
   * Timeout for requests in milliseconds
   * @default 30000 (30 seconds)
   */
  timeoutMs?: number;
}

/**
 * Base interface for completion options
 */
export interface CompletionOptions {
  /**
   * Model to use
   */
  model: string;
  
  /**
   * Maximum number of tokens to generate
   */
  maxTokens?: number;
  
  /**
   * Temperature for response generation (0-2)
   * Higher values = more creative, lower values = more deterministic
   */
  temperature?: number;
  
  /**
   * Stop sequences that will halt generation
   */
  stop?: string[];
  
  /**
   * Additional model parameters
   */
  [key: string]: any;
}

/**
 * Interface for completion response
 */
export interface CompletionResponse<T = any> {
  /**
   * Generated text or structured content
   */
  content: T;
  
  /**
   * Model used for generation
   */
  model: string;
  
  /**
   * Provider-specific response details
   */
  details: any;
  
  /**
   * Usage information
   */
  usage?: {
    /**
     * Number of tokens in the prompt
     */
    promptTokens: number;
    
    /**
     * Number of tokens in the generated content
     */
    completionTokens: number;
    
    /**
     * Total tokens used
     */
    totalTokens: number;
  };
}

/**
 * Base interface that all providers must implement
 */
export interface AIProvider {
  /**
   * Makes a completion request to generate text
   * @param prompt Text prompt to complete
   * @param options Options for the completion request
   */
  complete(prompt: string, options?: CompletionOptions): Promise<CompletionResponse>;
  
  /**
   * Makes a chat completion request (multi-turn conversations)
   * @param messages Array of conversation messages
   * @param options Options for the chat completion request
   */
  chat(messages: any[], options?: CompletionOptions): Promise<CompletionResponse>;
  
  /**
   * Generates embeddings for a text
   * @param input Text to generate embeddings for
   * @param options Options for the embeddings request
   */
  embeddings(input: string | string[], options?: any): Promise<number[][] | number[]>;
} 