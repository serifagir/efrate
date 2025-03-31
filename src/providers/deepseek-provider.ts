import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  AIProvider,
  ProviderOptions,
  CompletionOptions,
  CompletionResponse
} from './base-provider';

/**
 * Extended options specific to DeepSeek
 */
export interface DeepSeekOptions extends ProviderOptions {
  /**
   * Organization ID for DeepSeek API (if applicable)
   */
  organizationId?: string;
}

/**
 * DeepSeek API provider implementation
 */
export class DeepSeekProvider implements AIProvider {
  private client: AxiosInstance;
  private apiKey: string;
  private defaultModel = 'deepseek-chat';

  /**
   * Creates a new DeepSeek provider
   * @param options Configuration options
   */
  constructor(options: DeepSeekOptions) {
    this.apiKey = options.apiKey;
    
    const baseURL = options.baseUrl || 'https://api.deepseek.com/v1';
    const timeout = options.timeoutMs || 30000;
    
    // Initialize axios client
    this.client = axios.create({
      baseURL,
      timeout,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...(options.organizationId && { 'DeepSeek-Organization': options.organizationId }),
        ...options.headers
      }
    });
    
    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: any) => {
        const enhancedError = new Error(
          `DeepSeek API Error: ${error.response?.data?.error?.message || error.message}`
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
   * Makes a text completion request to DeepSeek
   * @param prompt Text prompt to complete
   * @param options Completion options
   * @returns Completion response
   */
  async complete(
    prompt: string,
    options: CompletionOptions = { model: this.defaultModel }
  ): Promise<CompletionResponse> {
    // For DeepSeek, we'll use the chat API for all completions
    const messages = [{ role: 'user', content: prompt }];
    return this.chat(messages, options);
  }

  /**
   * Makes a chat completion request to DeepSeek
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
      stop: otherOptions.stop,
      ...otherOptions
    });
    
    const data = response.data;
    
    return {
      content: data.choices[0].message.content,
      model: data.model,
      details: data,
      usage: {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens
      }
    };
  }

  /**
   * Generates embeddings for text using DeepSeek
   * @param input Text or array of texts
   * @param options Embedding options
   * @returns Vector embeddings
   */
  async embeddings(
    input: string | string[],
    options: { model?: string } = {}
  ): Promise<number[][]> {
    const model = options.model || 'deepseek-embedding';
    const texts = Array.isArray(input) ? input : [input];
    
    const response = await this.client.post('/embeddings', {
      model,
      input: texts
    });
    
    return response.data.data.map((item: any) => item.embedding);
  }
} 