
# Efrate

[![npm version](https://img.shields.io/npm/v/efrate.svg)](https://www.npmjs.com/package/efrate)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9%2B-blue)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Stars](https://img.shields.io/github/stars/serifagir/efrate)](https://github.com/serifagir/efrate/stargazers)
[![Documentation](https://img.shields.io/badge/docs-online-brightgreen.svg)](https://serifagir.github.io/efrate/index.html)

> 🚀 **Efrate** is a powerful TypeScript library that optimizes your AI API interactions by implementing intelligent caching, rate limiting, and request batching. It provides a unified interface for multiple AI providers (OpenAI, Anthropic, DeepSeek, Perplexity) to simplify your code while reducing costs and improving performance.

Efrate is an efficient rate-limiting and optimization package for AI API requests. It helps you make the most of your AI API usage by implementing smart caching, rate limiting, and request batching.

📦 [NPM Package](https://www.npmjs.com/package/efrate) | 📚 [Documentation](https://serifagir.github.io/efrate/index.html) | 💻 [GitHub Repository](https://github.com/serifagir/efrate)

## Features

- **Smart Rate Limiting**: Avoid rate limit errors with configurable token bucket algorithm.
- **Response Caching**: Reduce duplicate API calls with intelligent caching, including fuzzy matching.
- **Request Batching**: Group similar requests together to reduce API calls and costs.
- **Multiple Provider Support**: Works with OpenAI, Anthropic, DeepSeek, and Perplexity APIs.
- **Provider Abstraction**: Unified interface for multiple AI service providers.
- **TypeScript Support**: Full type definitions for better development experience.

## Installation

```bash
npm install efrate
```

## Quick Start

```typescript
import { EfrateClient } from 'efrate';

// Create an instance of the client
const client = new EfrateClient({
  provider: 'openai',
  providerOptions: {
    apiKey: 'your-api-key'
  }
});

// Make AI requests efficiently
async function example() {
  // Simple completion
  const response = await client.complete(
    'Explain quantum computing in simple terms',
    { model: 'gpt-3.5-turbo' }
  );
  console.log(response.content);
  
  // Chat completion
  const chatResponse = await client.chat([
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'What is the capital of France?' }
  ]);
  console.log(chatResponse.content);
}

example().catch(console.error);
```

## Supported Providers

Efrate supports multiple AI service providers through a unified interface:

### OpenAI

```typescript
const openaiClient = new EfrateClient({
  provider: 'openai',
  providerOptions: {
    apiKey: 'your-openai-api-key',
    organizationId: 'your-org-id' // Optional
  }
});
```

### Anthropic

```typescript
const anthropicClient = new EfrateClient({
  provider: 'anthropic',
  providerOptions: {
    apiKey: 'your-anthropic-api-key',
    apiVersion: '2023-06-01' // Optional
  }
});
```

### DeepSeek

```typescript
const deepseekClient = new EfrateClient({
  provider: 'deepseek',
  providerOptions: {
    apiKey: 'your-deepseek-api-key',
    organizationId: 'your-org-id' // Optional
  }
});
```

### Perplexity

```typescript
const perplexityClient = new EfrateClient({
  provider: 'perplexity',
  providerOptions: {
    apiKey: 'your-perplexity-api-key'
  }
});
```

### Custom Provider

You can also implement your own provider by implementing the `AIProvider` interface:

```typescript
import { EfrateClient, AIProvider } from 'efrate';

// Create your custom provider implementation
class MyCustomProvider implements AIProvider {
  // Implement required methods...
}

// Use it with Efrate
const customClient = new EfrateClient({
  provider: 'custom',
  providerOptions: {}, // Not used for custom providers
  customProvider: new MyCustomProvider()
});
```

## Advanced Configuration

```typescript
import { EfrateClient } from 'efrate';

const client = new EfrateClient({
  provider: 'openai',
  providerOptions: {
    apiKey: 'your-api-key',
    organizationId: 'your-org-id' // Optional
  },
  
  // Cache configuration
  enableCache: true,
  cacheOptions: {
    maxSize: 1000,
    ttlMs: 3600000, // 1 hour
    similarityThreshold: 0.92,
    enableFuzzyMatching: true
  },
  
  // Rate limiting configuration
  enableRateLimiting: true,
  rateLimiterOptions: {
    tokensPerInterval: 50,  // 50 requests
    intervalInMs: 60000,    // per minute
    maxWaitTimeMs: 120000,  // Wait up to 2 minutes for a token
    autoWait: true          // Automatically wait for tokens
  },
  
  // Batching configuration
  enableBatching: true,
  batcherOptions: {
    maxBatchSize: 20,
    maxDelayMs: 100
  }
});
```

## Usage Examples

### Simple Completion

```typescript
const response = await client.complete(
  'Write a poem about programming',
  { model: 'gpt-3.5-turbo' }
);
console.log(response.content);
```

### Chat Completion

```typescript
const chatResponse = await client.chat([
  { role: 'system', content: 'You are a helpful assistant.' },
  { role: 'user', content: 'How do I make a chocolate cake?' }
]);
console.log(chatResponse.content);
```

### Generate Embeddings

```typescript
const embeddings = await client.embeddings('The quick brown fox jumps over the lazy dog');
console.log(embeddings);
```

## Benefits

- **Cost Reduction**: Reduce API costs by caching responses and batching requests.
- **Higher Throughput**: Process more requests without hitting rate limits.
- **Better UX**: Faster responses for end users by leveraging the cache.
- **Simplified Code**: Clean interface abstracts away the complexity of efficient API usage.
- **Provider Flexibility**: Easily switch between different AI providers without changing your code.

## License

MIT
