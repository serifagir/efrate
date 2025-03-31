/**
 * Basic sanity check for the package
 */

import { EfrateClient } from '../src';

describe('EfrateClient', () => {
  it('should be defined', () => {
    expect(EfrateClient).toBeDefined();
  });

  it('should be instantiable', () => {
    expect(() => {
      new EfrateClient({
        provider: 'openai',
        providerOptions: {
          apiKey: 'test-key'
        }
      });
    }).not.toThrow();
  });
}); 