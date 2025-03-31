# Efrate Documentation

Efrate is an efficient rate-limiting and optimization package for AI API requests. It helps you make the most of your AI API usage by implementing smart caching, rate limiting, and request batching.

## Key Features

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

// Create a client with your API key
const client = new EfrateClient({
  provider: 'openai',
  providerOptions: {
    apiKey: process.env.OPENAI_API_KEY
  }
});

// Make AI requests efficiently
async function example() {
  const response = await client.complete(
    'Explain quantum computing in simple terms',
    { model: 'gpt-3.5-turbo' }
  );
  console.log(response.content);
}

example().catch(console.error);
```

## Documentation

- [Getting Started](./getting-started.md)
- [Provider Configuration](./providers.md)
- [Rate Limiting Options](./rate-limiting.md)
- [Caching Options](./caching.md)
- [Request Batching](./batching.md)
- [API Reference](./api-reference.md)
- [Examples](./examples.md)

## Benefits

- **Cost Reduction**: Reduce API costs by caching responses and batching requests.
- **Higher Throughput**: Process more requests without hitting rate limits.
- **Better UX**: Faster responses for end users by leveraging the cache.
- **Simplified Code**: Clean interface abstracts away the complexity of efficient API usage.
- **Provider Flexibility**: Easily switch between different AI providers without changing your code.

## GitHub Repository

View the source code and contribute on [GitHub](https://github.com/serifagir/efrate). 