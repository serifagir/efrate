# Examples

Here are comprehensive examples showing how to use Efrate in various scenarios.

## Basic Usage

This example demonstrates the core functionality of Efrate with OpenAI:

```typescript
import { EfrateClient } from 'efrate';

// Initialize with your API key
const client = new EfrateClient({
  provider: 'openai',
  providerOptions: {
    apiKey: process.env.OPENAI_API_KEY
  }
});

async function basicExample() {
  try {
    // Make a completion request
    const response = await client.complete(
      'Explain how JavaScript Promises work in simple terms',
      { model: 'gpt-3.5-turbo' }
    );
    
    console.log('Response:');
    console.log(response.content);
    console.log(`Tokens used: ${response.usage?.totalTokens}`);
    
    // Demonstrate caching - second identical request uses cache
    console.log('\nMaking same request again (should use cache):');
    const cachedResponse = await client.complete(
      'Explain how JavaScript Promises work in simple terms',
      { model: 'gpt-3.5-turbo' }
    );
    
    console.log('Cached response:');
    console.log(cachedResponse.content);
    
    // Chat completion
    console.log('\nChat example:');
    const chatResponse = await client.chat([
      { role: 'system', content: 'You are a helpful programming assistant.' },
      { role: 'user', content: 'How do I use async/await in JavaScript?' }
    ]);
    
    console.log('Chat response:');
    console.log(chatResponse.content);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

basicExample();
```

## Using Multiple Providers

This example shows how to use different AI providers:

```typescript
import { EfrateClient } from 'efrate';

// Setup clients for different providers
const openaiClient = new EfrateClient({
  provider: 'openai',
  providerOptions: {
    apiKey: process.env.OPENAI_API_KEY
  }
});

const anthropicClient = new EfrateClient({
  provider: 'anthropic',
  providerOptions: {
    apiKey: process.env.ANTHROPIC_API_KEY
  }
});

const deepseekClient = new EfrateClient({
  provider: 'deepseek',
  providerOptions: {
    apiKey: process.env.DEEPSEEK_API_KEY
  }
});

const perplexityClient = new EfrateClient({
  provider: 'perplexity',
  providerOptions: {
    apiKey: process.env.PERPLEXITY_API_KEY
  }
});

async function multiProviderExample() {
  const prompt = 'Explain the concept of machine learning in one paragraph';
  
  try {
    // Ask the same question to different providers
    console.log('OpenAI:');
    const openaiResponse = await openaiClient.complete(prompt);
    console.log(openaiResponse.content);
    
    console.log('\nAnthropic:');
    const anthropicResponse = await anthropicClient.complete(prompt);
    console.log(anthropicResponse.content);
    
    console.log('\nDeepSeek:');
    const deepseekResponse = await deepseekClient.complete(prompt);
    console.log(deepseekResponse.content);
    
    console.log('\nPerplexity:');
    const perplexityResponse = await perplexityClient.complete(prompt);
    console.log(perplexityResponse.content);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

multiProviderExample();
```

## Advanced Configuration

This example demonstrates how to configure advanced options:

```typescript
import { EfrateClient } from 'efrate';

// Create a client with advanced configuration
const client = new EfrateClient({
  provider: 'openai',
  providerOptions: {
    apiKey: process.env.OPENAI_API_KEY
  },
  
  // Cache configuration
  enableCache: true,
  cacheOptions: {
    maxSize: 500,             // Maximum number of items in cache
    ttlMs: 1800000,           // Time-to-live: 30 minutes
    similarityThreshold: 0.92, // Threshold for fuzzy matching
    enableFuzzyMatching: true  // Enable similar prompt matching
  },
  
  // Rate limiting configuration
  enableRateLimiting: true,
  rateLimiterOptions: {
    tokensPerInterval: 45,     // 45 requests...
    intervalInMs: 60000,       // ...per minute
    maxWaitTimeMs: 120000,     // Wait up to 2 minutes when rate limited
    autoWait: true             // Automatically wait for tokens
  },
  
  // Request batching configuration
  enableBatching: true,
  batcherOptions: {
    maxBatchSize: 10,         // Maximum number of requests per batch
    maxDelayMs: 200           // Maximum delay before processing a batch
  }
});

async function advancedExample() {
  try {
    // Run multiple requests to demonstrate rate limiting
    console.log('Running multiple requests...');
    const promises = [];
    
    for (let i = 0; i < 10; i++) {
      const prompt = `Question ${i+1}: What is the capital of ${getRandomCountry()}?`;
      promises.push(client.complete(prompt).then(response => {
        console.log(`Response ${i+1}: ${response.content.slice(0, 50)}...`);
        return response;
      }));
    }
    
    await Promise.all(promises);
    console.log('All requests completed successfully!');
    
    // Check the cache size
    console.log(`Cache size: ${client.cache.size}`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

function getRandomCountry() {
  const countries = [
    'France', 'Japan', 'Brazil', 'Australia', 'Egypt',
    'Canada', 'India', 'Mexico', 'Germany', 'South Africa'
  ];
  return countries[Math.floor(Math.random() * countries.length)];
}

advancedExample();
```

## Error Handling

This example shows how to handle errors properly:

```typescript
import { EfrateClient } from 'efrate';

const client = new EfrateClient({
  provider: 'openai',
  providerOptions: {
    apiKey: process.env.OPENAI_API_KEY
  }
});

async function errorHandlingExample() {
  try {
    // Example 1: Handle non-existent model
    try {
      const response = await client.complete(
        'Test prompt',
        { model: 'non-existent-model' }
      );
    } catch (error) {
      console.log('Model error caught:', error.message);
    }
    
    // Example 2: Handle rate limiting
    const rateLimitClient = new EfrateClient({
      provider: 'openai',
      providerOptions: { apiKey: process.env.OPENAI_API_KEY },
      rateLimiterOptions: {
        tokensPerInterval: 1,
        intervalInMs: 60000,
        maxWaitTimeMs: 1000, // Only wait 1 second max
        autoWait: true
      }
    });
    
    try {
      // These will exceed our configured rate limit
      await rateLimitClient.complete('Request 1');
      await rateLimitClient.complete('Request 2');
    } catch (error) {
      console.log('Rate limit error caught:', error.message);
    }
    
    // Example 3: Graceful error handling in a batch
    try {
      const results = await Promise.allSettled([
        client.complete('Valid request'),
        client.complete('', { model: 'invalid-model' }) // Empty prompt
      ]);
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          console.log(`Request ${index+1} succeeded:`, result.value.content.slice(0, 50));
        } else {
          console.log(`Request ${index+1} failed:`, result.reason.message);
        }
      });
    } catch (error) {
      console.log('This should not be reached due to Promise.allSettled');
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

errorHandlingExample();
```

## Streaming Responses

This example shows how to handle streaming responses from OpenAI:

```typescript
import { EfrateClient, OpenAIProvider } from 'efrate';

// For streaming, we need to work directly with the provider
const provider = new OpenAIProvider({
  apiKey: process.env.OPENAI_API_KEY
});

async function streamingExample() {
  try {
    const messages = [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'Write a short story about a robot discovering art.' }
    ];
    
    const response = await provider.chat(messages, {
      model: 'gpt-4',
      stream: true,
      onToken: (token) => {
        // Process each token as it arrives
        process.stdout.write(token);
      }
    });
    
    console.log('\n\nStreaming completed!');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

streamingExample();
```

## Custom Provider Implementation

This example shows how to implement and use a custom provider:

```typescript
import { 
  EfrateClient, 
  AIProvider, 
  CompletionOptions, 
  CompletionResponse 
} from 'efrate';
import axios from 'axios';

// Implement a custom provider for a hypothetical AI API
class CustomAIProvider implements AIProvider {
  private apiKey: string;
  private baseURL: string;
  
  constructor(options: any) {
    this.apiKey = options.apiKey;
    this.baseURL = options.baseURL || 'https://api.customai.example';
  }
  
  async complete(prompt: string, options: CompletionOptions = { model: 'default' }): Promise<CompletionResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/generate`, {
        prompt,
        model: options.model,
        max_tokens: options.maxTokens || 1024,
        temperature: options.temperature || 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      return {
        content: response.data.text,
        model: options.model,
        details: response.data,
        usage: {
          promptTokens: response.data.usage?.prompt_tokens || 0,
          completionTokens: response.data.usage?.completion_tokens || 0,
          totalTokens: response.data.usage?.total_tokens || 0
        }
      };
    } catch (error) {
      throw new Error(`Custom AI Provider Error: ${error.message}`);
    }
  }
  
  async chat(messages: any[], options: CompletionOptions = { model: 'default' }): Promise<CompletionResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/chat`, {
        messages,
        model: options.model,
        max_tokens: options.maxTokens || 1024,
        temperature: options.temperature || 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      return {
        content: response.data.message.content,
        model: options.model,
        details: response.data,
        usage: {
          promptTokens: response.data.usage?.prompt_tokens || 0,
          completionTokens: response.data.usage?.completion_tokens || 0,
          totalTokens: response.data.usage?.total_tokens || 0
        }
      };
    } catch (error) {
      throw new Error(`Custom AI Provider Error: ${error.message}`);
    }
  }
  
  async embeddings(input: string | string[], options: any = {}): Promise<number[][]> {
    try {
      const texts = Array.isArray(input) ? input : [input];
      
      const response = await axios.post(`${this.baseURL}/embeddings`, {
        texts,
        model: options.model || 'default-embedding'
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data.embeddings;
    } catch (error) {
      throw new Error(`Custom AI Provider Error: ${error.message}`);
    }
  }
}

// Use the custom provider with Efrate
const client = new EfrateClient({
  provider: 'custom',
  providerOptions: {}, // Not used directly
  customProvider: new CustomAIProvider({
    apiKey: 'your-custom-api-key',
    baseURL: 'https://api.customai.example'
  })
});

async function customProviderExample() {
  try {
    const response = await client.complete('How does a nuclear reactor work?');
    console.log(response.content);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Note: This won't actually work unless you have the custom API
// customProviderExample();
```

## More Examples

See the [examples directory](https://github.com/serifagir/efrate/tree/main/examples) in the GitHub repository for more examples. 