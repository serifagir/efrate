import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  AIProvider,
  ProviderOptions,
  CompletionOptions,
  CompletionResponse
} from './base-provider';

/**
 * Extended options specific to Perplexity
 */
export interface PerplexityOptions extends ProviderOptions {
  /**
   * Optional additional configuration for Perplexity API
   */
  perplexityOptions?: Record<string, any>;
}

/**
 * Perplexity API provider implementation
 */
export class PerplexityProvider implements AIProvider {
  private client: AxiosInstance;
  private apiKey: string;
  private defaultModel = 'sonar-medium-online';

  /**
   * Creates a new Perplexity provider
   * @param options Configuration options
   */
  constructor(options: PerplexityOptions) {
    this.apiKey = options.apiKey;
    
    const baseURL = options.baseUrl || 'https://api.perplexity.ai';
    const timeout = options.timeoutMs || 30000;
    
    // Initialize axios client
    this.client = axios.create({
      baseURL,
      timeout,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: any) => {
        const enhancedError = new Error(
          `Perplexity API Error: ${error.response?.data?.error?.message || error.message}`
        );
        
        Object.assign(enhancedError, {
          status: error.response?.status,
          data: error.response?.data,
          originalError: error
        });
        
        return Promise.reject(enhancedError);
      }
    );
  }

  /**
   * Makes a text completion request to Perplexity
   * @param prompt Text prompt to complete
   * @param options Completion options
   * @returns Completion response
   */
  async complete(
    prompt: string,
    options: CompletionOptions = { model: this.defaultModel }
  ): Promise<CompletionResponse> {
    // For Perplexity, we'll use the chat API for all completions
    const messages = [{ role: 'user', content: prompt }];
    return this.chat(messages, options);
  }

  /**
   * Makes a chat completion request to Perplexity
   * @param messages Array of conversation messages
   * @param options Completion options
   * @returns Chat completion response
   */
  async chat(
    messages: any[],
    options: CompletionOptions = { model: this.defaultModel }
  ): Promise<CompletionResponse> {
    const modelName = options.model || this.defaultModel;
    
    // Extract properties that would cause duplication
    const { model, ...otherOptions } = options;
    
    const response = await this.client.post('/chat/completions', {
      model: modelName,
      messages,
      max_tokens: otherOptions.maxTokens,
      temperature: otherOptions.temperature,
      ...otherOptions
    });
    
    const data = response.data;
    
    return {
      content: data.choices[0].message.content,
      model: data.model,
      details: data,
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0
      }
    };
  }

  /**
   * Generates embeddings for text using Perplexity
   * @param input Text or array of texts
   * @param options Embedding options
   * @returns Vector embeddings
   */
  async embeddings(
    input: string | string[],
    options: { model?: string } = {}
  ): Promise<number[][]> {
    throw new Error('Embeddings are not currently supported by the Perplexity API');
  }
} 