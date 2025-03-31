import { EfrateClient } from '../src';

// Your API key should be in an environment variable in a real application
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'your-api-key-here';

// Create an instance of the client with default settings
const client = new EfrateClient({
  provider: 'openai',
  providerOptions: {
    apiKey: OPENAI_API_KEY
  }
});

async function runExamples(): Promise<void> {
  try {
    console.log('Making first request...');
    const response1 = await client.complete(
      'Explain how JavaScript Promises work in 2 sentences.',
      { model: 'gpt-3.5-turbo' }
    );
    
    console.log('First response:');
    console.log(response1.content);
    console.log(`Tokens used: ${response1.usage?.totalTokens}`);
    console.log('\n');
    
    // Same question - should come from cache
    console.log('Making second request (identical to first - should use cache)...');
    const response2 = await client.complete(
      'Explain how JavaScript Promises work in 2 sentences.',
      { model: 'gpt-3.5-turbo' }
    );
    
    console.log('Second response (from cache):');
    console.log(response2.content);
    console.log('\n');
    
    // Chat example
    console.log('Making a chat request...');
    const chatResponse = await client.chat([
      { role: 'system', content: 'You are a helpful assistant who answers briefly.' },
      { role: 'user', content: 'What is TypeScript and why would I use it?' }
    ]);
    
    console.log('Chat response:');
    console.log(chatResponse.content);
    console.log(`Tokens used: ${chatResponse.usage?.totalTokens}`);
    
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

// Run the examples
runExamples().catch(console.error); 