# Provider Configuration

Efrate supports multiple AI providers through a unified interface. This guide explains how to configure and use different providers.

## Supported Providers

Currently, Efrate supports the following AI providers:

- OpenAI
- Anthropic
- DeepSeek
- Perplexity

## OpenAI

OpenAI is the default provider and supports various GPT models including GPT-3.5 and GPT-4.

```typescript
import { EfrateClient } from 'efrate';

const client = new EfrateClient({
  provider: 'openai',
  providerOptions: {
    apiKey: 'your-openai-api-key',
    organizationId: 'your-org-id',  // Optional
    baseUrl: 'https://api.openai.com/v1',  // Optional, default OpenAI API URL
    headers: {  // Optional additional headers
      'x-custom-header': 'custom-value'
    },
    timeoutMs: 30000  // Optional timeout in milliseconds (default: 30000)
  }
});

// Usage examples
async function openaiExample() {
  // Completion
  const completion = await client.complete(
    'Explain quantum computing briefly',
    { model: 'gpt-3.5-turbo' }
  );
  
  // Chat
  const chat = await client.chat([
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'What is machine learning?' }
  ], { model: 'gpt-4' });
  
  // Embeddings
  const embeddings = await client.embeddings(
    'Text to embed',
    { model: 'text-embedding-ada-002' }
  );
}
```

## Anthropic

Anthropic provides Claude models, which excel at following instructions and nuanced reasoning.

```typescript
import { EfrateClient } from 'efrate';

const client = new EfrateClient({
  provider: 'anthropic',
  providerOptions: {
    apiKey: 'your-anthropic-api-key',
    apiVersion: '2023-06-01',  // Optional API version
    baseUrl: 'https://api.anthropic.com',  // Optional, default Anthropic API URL
    headers: {},  // Optional additional headers
    timeoutMs: 30000  // Optional timeout in milliseconds
  }
});

// Usage examples
async function anthropicExample() {
  // Completion
  const completion = await client.complete(
    'Create a short story about robots learning to paint',
    { model: 'claude-3-sonnet-20240229' }
  );
  
  // Chat
  const chat = await client.chat([
    { role: 'system', content: 'You are Claude, a helpful AI assistant.' },
    { role: 'user', content: 'Explain how photosynthesis works' }
  ], { model: 'claude-3-opus-20240229' });
  
  // Note: Anthropic doesn't currently support embeddings
}
```

## DeepSeek

DeepSeek offers AI models focused on deep understanding and reasoning.

```typescript
import { EfrateClient } from 'efrate';

const client = new EfrateClient({
  provider: 'deepseek',
  providerOptions: {
    apiKey: 'your-deepseek-api-key',
    organizationId: 'your-org-id',  // Optional
    baseUrl: 'https://api.deepseek.com/v1',  // Optional
    headers: {},  // Optional additional headers
    timeoutMs: 30000  // Optional timeout in milliseconds
  }
});

// Usage examples
async function deepseekExample() {
  // Completion
  const completion = await client.complete(
    'Explain how neural networks learn',
    { model: 'deepseek-chat' }
  );
  
  // Chat
  const chat = await client.chat([
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'What are the main applications of reinforcement learning?' }
  ], { model: 'deepseek-chat' });
  
  // Embeddings
  const embeddings = await client.embeddings(
    'Text to embed',
    { model: 'deepseek-embedding' }
  );
}
```

## Perplexity

Perplexity offers models that excel at providing informative responses.

```typescript
import { EfrateClient } from 'efrate';

const client = new EfrateClient({
  provider: 'perplexity',
  providerOptions: {
    apiKey: 'your-perplexity-api-key',
    baseUrl: 'https://api.perplexity.ai',  // Optional
    headers: {},  // Optional additional headers
    timeoutMs: 30000  // Optional timeout in milliseconds
  }
});

// Usage examples
async function perplexityExample() {
  // Completion
  const completion = await client.complete(
    'What are the latest advancements in fusion energy?',
    { model: 'sonar-medium-online' }
  );
  
  // Chat
  const chat = await client.chat([
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Explain the concept of blockchain technology' }
  ], { model: 'sonar-medium-online' });
  
  // Note: Perplexity doesn't currently support embeddings
}
```

## Custom Provider

You can implement your own provider by creating a class that implements the `AIProvider` interface:

```typescript
import { EfrateClient, AIProvider, CompletionOptions, CompletionResponse } from 'efrate';

class MyCustomProvider implements AIProvider {
  constructor(options: any) {
    // Initialize your provider
  }
  
  async complete(prompt: string, options?: CompletionOptions): Promise<CompletionResponse> {
    // Implement completion logic
  }
  
  async chat(messages: any[], options?: CompletionOptions): Promise<CompletionResponse> {
    // Implement chat logic
  }
  
  async embeddings(input: string | string[], options?: any): Promise<number[][] | number[]> {
    // Implement embeddings logic
  }
}

// Use your custom provider
const client = new EfrateClient({
  provider: 'custom',
  providerOptions: {},  // This is passed to your custom provider
  customProvider: new MyCustomProvider({ /* your options */ })
});
```

## Switching Between Providers

You can easily switch between providers without changing your application code:

```typescript
// Configuration for different providers
const openaiConfig = {
  provider: 'openai',
  providerOptions: { apiKey: process.env.OPENAI_API_KEY }
};

const anthropicConfig = {
  provider: 'anthropic',
  providerOptions: { apiKey: process.env.ANTHROPIC_API_KEY }
};

// Create clients
const openaiClient = new EfrateClient(openaiConfig);
const anthropicClient = new EfrateClient(anthropicConfig);

// Same code works with both providers
async function askQuestion(client, question) {
  const response = await client.complete(question, { model: client.defaultModel });
  return response.content;
}

// Usage
askQuestion(openaiClient, "What is quantum computing?");
askQuestion(anthropicClient, "What is quantum computing?");
```

## Next Steps

- Learn about [Rate Limiting Options](./rate-limiting.md)
- Explore [Caching Options](./caching.md)
- See [Examples](./examples.md) 