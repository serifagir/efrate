import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  AIProvider,
  ProviderOptions,
  CompletionOptions,
  CompletionResponse
} from './base-provider';

/**
 * Extended options specific to Anthropic
 */
export interface AnthropicOptions extends ProviderOptions {
  /**
   * Version of the Anthropic API to use
   * @default '2023-06-01'
   */
  apiVersion?: string;
}

/**
 * Message format for Anthropic API
 */
interface AnthropicMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Anthropic API provider implementation
 */
export class AnthropicProvider implements AIProvider {
  private client: AxiosInstance;
  private apiKey: string;
  private defaultModel = 'claude-3-sonnet-20240229';
  private apiVersion: string;

  /**
   * Creates a new Anthropic provider
   * @param options Configuration options
   */
  constructor(options: AnthropicOptions) {
    this.apiKey = options.apiKey;
    this.apiVersion = options.apiVersion || '2023-06-01';
    
    const baseURL = options.baseUrl || 'https://api.anthropic.com';
    const timeout = options.timeoutMs || 30000;
    
    // Initialize axios client
    this.client = axios.create({
      baseURL,
      timeout,
      headers: {
        'x-api-key': this.apiKey,
        'anthropic-version': this.apiVersion,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: any) => {
        const enhancedError = new Error(
          `Anthropic API Error: ${error.response?.data?.error?.message || error.message}`
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
   * Makes a text completion request to Anthropic
   * @param prompt Text prompt to complete
   * @param options Completion options
   * @returns Completion response
   */
  async complete(
    prompt: string,
    options: CompletionOptions = { model: this.defaultModel }
  ): Promise<CompletionResponse> {
    // Anthropic doesn't have a dedicated completion API
    // So we use the chat API with a single user message
    const messages = [{ role: 'user', content: prompt }];
    return this.chat(messages, options);
  }

  /**
   * Makes a chat completion request to Anthropic
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
    const { model, maxTokens, temperature, stop, ...otherOptions } = options;
    
    // Format messages for Anthropic API
    const formattedMessages = messages.map(msg => ({
      role: msg.role === 'system' ? 'user' : msg.role,
      content: msg.content
    }));
    
    // Add system prompt if provided
    const systemPrompt = messages.find(m => m.role === 'system')?.content;
    
    const response = await this.client.post('/v1/messages', {
      model: modelName,
      messages: formattedMessages,
      max_tokens: maxTokens || 1024,
      temperature: temperature,
      stop_sequences: stop,
      ...(systemPrompt && { system: systemPrompt }),
      ...otherOptions
    });
    
    const data = response.data;
    
    return {
      content: data.content[0].text,
      model: data.model,
      details: data,
      usage: {
        promptTokens: data.usage?.input_tokens || 0,
        completionTokens: data.usage?.output_tokens || 0,
        totalTokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0)
      }
    };
  }

  /**
   * Generates embeddings for text using Anthropic
   * @param input Text or array of texts
   * @param options Embedding options
   * @returns Vector embeddings
   */
  async embeddings(
    input: string | string[],
    options: { model?: string } = {}
  ): Promise<number[][]> {
    throw new Error('Embeddings are not currently supported by the Anthropic API');
  }
} 