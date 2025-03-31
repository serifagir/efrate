import { TokenBucket } from './utils/token-bucket';

/**
 * Options for configuring the rate limiter
 */
export interface RateLimiterOptions {
  /**
   * Maximum number of requests in time window
   */
  tokensPerInterval: number;
  
  /**
   * Time window in milliseconds
   */
  intervalInMs: number;
  
  /**
   * Maximum time to wait for a token in milliseconds
   * @default 60000 (1 minute)
   */
  maxWaitTimeMs?: number;
  
  /**
   * Whether to automatically wait for a token when one is not available
   * @default true
   */
  autoWait?: boolean;
}

/**
 * Handles rate limiting for API requests
 */
export class RateLimiter {
  private bucket: TokenBucket;
  private maxWaitTimeMs: number;
  private autoWait: boolean;

  /**
   * Creates a new rate limiter
   * @param options Configuration options
   */
  constructor(options: RateLimiterOptions) {
    this.bucket = new TokenBucket(options.tokensPerInterval, options.intervalInMs);
    this.maxWaitTimeMs = options.maxWaitTimeMs || 60000; // Default to 1 minute
    this.autoWait = options.autoWait !== undefined ? options.autoWait : true;
  }

  /**
   * Acquires a token for making an API request
   * @param weight Token weight of this request (default: 1)
   * @returns Promise that resolves to true if token acquired, false otherwise
   */
  async acquireToken(weight = 1): Promise<boolean> {
    // First try to get a token immediately
    if (this.bucket.takeTokens(weight)) {
      return true;
    }
    
    // If auto wait is disabled, fail immediately
    if (!this.autoWait) {
      return false;
    }
    
    const waitTime = this.bucket.getWaitTimeMs(weight);
    
    // If wait time exceeds max wait time, fail
    if (waitTime > this.maxWaitTimeMs) {
      return false;
    }
    
    // Wait for token to become available
    await new Promise(resolve => setTimeout(resolve, waitTime));
    
    // Should be available now, but double-check
    return this.bucket.takeTokens(weight);
  }
  
  /**
   * Calculates wait time until the specified number of tokens will be available
   * @param weight Token weight (default: 1)
   * @returns Time in milliseconds
   */
  getWaitTimeMs(weight = 1): number {
    return this.bucket.getWaitTimeMs(weight);
  }
} 