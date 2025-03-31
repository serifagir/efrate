import { EfrateClient } from '../src';

// Your API keys should be in environment variables in a real application
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'your-openai-api-key';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || 'your-anthropic-api-key';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'your-deepseek-api-key';
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY || 'your-perplexity-api-key';

// Example using OpenAI provider
const openaiClient = new EfrateClient({
  provider: 'openai',
  providerOptions: {
    apiKey: OPENAI_API_KEY
  }
});

// Example using Anthropic provider
const anthropicClient = new EfrateClient({
  provider: 'anthropic',
  providerOptions: {
    apiKey: ANTHROPIC_API_KEY,
    apiVersion: '2023-06-01' // Optional, use the appropriate version
  }
});

// Example using DeepSeek provider
const deepseekClient = new EfrateClient({
  provider: 'deepseek',
  providerOptions: {
    apiKey: DEEPSEEK_API_KEY
  }
});

// Example using Perplexity provider
const perplexityClient = new EfrateClient({
  provider: 'perplexity',
  providerOptions: {
    apiKey: PERPLEXITY_API_KEY
  }
});

async function compareProviders(): Promise<void> {
  const prompt = 'Explain quantum computing in one short paragraph';
  
  try {
    console.log('--- OpenAI Response ---');
    const openaiResponse = await openaiClient.complete(prompt, { model: 'gpt-3.5-turbo' });
    console.log(openaiResponse.content);
    console.log(`Tokens used: ${openaiResponse.usage?.totalTokens}`);
    console.log('\n');
    
    console.log('--- Anthropic Response ---');
    const anthropicResponse = await anthropicClient.complete(prompt, { model: 'claude-3-sonnet-20240229' });
    console.log(anthropicResponse.content);
    console.log(`Tokens used: ${anthropicResponse.usage?.totalTokens}`);
    console.log('\n');
    
    console.log('--- DeepSeek Response ---');
    const deepseekResponse = await deepseekClient.complete(prompt, { model: 'deepseek-chat' });
    console.log(deepseekResponse.content);
    console.log(`Tokens used: ${deepseekResponse.usage?.totalTokens}`);
    console.log('\n');
    
    console.log('--- Perplexity Response ---');
    const perplexityResponse = await perplexityClient.complete(prompt, { model: 'sonar-medium-online' });
    console.log(perplexityResponse.content);
    console.log(`Tokens used: ${perplexityResponse.usage?.totalTokens}`);
    
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

// Only run this if API keys are properly set
function hasValidAPIKeys(): boolean {
  return (
    OPENAI_API_KEY !== 'your-openai-api-key' || 
    ANTHROPIC_API_KEY !== 'your-anthropic-api-key' || 
    DEEPSEEK_API_KEY !== 'your-deepseek-api-key' || 
    PERPLEXITY_API_KEY !== 'your-perplexity-api-key'
  );
}

// Run the comparison if we have valid API keys
if (hasValidAPIKeys()) {
  compareProviders().catch(console.error);
} else {
  console.log('Please provide at least one valid API key in the environment variables to run this example.');
} 