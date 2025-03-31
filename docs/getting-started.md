# Getting Started with Efrate

This guide will help you get started with Efrate, the efficient rate-limiting and optimization package for AI API requests.

## Installation

Install Efrate using npm:

```bash
npm install efrate
```

Or using yarn:

```bash
yarn add efrate
```

## Basic Setup

Here's a simple example to get you started with Efrate:

```typescript
import { EfrateClient } from 'efrate';

// Create an Efrate client
const client = new EfrateClient({
  provider: 'openai',  // Specify which AI provider to use
  providerOptions: {
    apiKey: process.env.OPENAI_API_KEY  // Your API key
  }
});

// Now you can make AI API requests
async function main() {
  try {
    // Simple completion request
    const response = await client.complete(
      'Explain how to use TypeScript with Node.js',
      { model: 'gpt-3.5-turbo' }
    );
    
    console.log('AI Response:');
    console.log(response.content);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
```

## Enabling Features

Efrate has three main optimization features that you can enable or disable:

```typescript
const client = new EfrateClient({
  provider: 'openai',
  providerOptions: {
    apiKey: process.env.OPENAI_API_KEY
  },
  enableCache: true,       // Enable response caching
  enableRateLimiting: true, // Enable rate limiting
  enableBatching: true     // Enable request batching
});
```

## Core Concepts

### Rate Limiting

Efrate uses the token bucket algorithm to prevent rate limit errors. This allows you to:

- Set a maximum number of requests per time interval
- Configure the time window for rate limiting
- Set a maximum wait time for requests when the rate limit is reached

### Caching

The caching system stores responses to avoid making duplicate API calls, which:

- Reduces API costs
- Speeds up response times for repeat queries
- Supports fuzzy matching to find similar cached responses

### Request Batching

Batching groups similar requests together to:

- Reduce the number of API calls
- Improve throughput
- Handle concurrent requests more efficiently

## Next Steps

- Learn about [Provider Configuration](./providers.md)
- Explore [Rate Limiting Options](./rate-limiting.md)
- Configure [Caching Options](./caching.md)
- Set up [Request Batching](./batching.md)
- See more [Examples](./examples.md) 