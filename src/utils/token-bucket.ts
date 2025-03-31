/**
 * Implements the token bucket algorithm for rate limiting
 */
export class TokenBucket {
  private tokens: number;
  private maxTokens: number;
  private refillRate: number; // tokens per ms
  private lastRefill: number;

  /**
   * Creates a new token bucket
   * @param maxTokens Maximum number of tokens the bucket can hold
   * @param refillTimeMs Time in milliseconds to completely refill the bucket
   */
  constructor(maxTokens: number, refillTimeMs: number) {
    this.tokens = maxTokens;
    this.maxTokens = maxTokens;
    this.refillRate = maxTokens / refillTimeMs;
    this.lastRefill = Date.now();
  }

  /**
   * Refills the bucket based on time elapsed since last refill
   */
  private refill(): void {
    const now = Date.now();
    const elapsedMs = now - this.lastRefill;
    
    if (elapsedMs > 0) {
      const newTokens = elapsedMs * this.refillRate;
      this.tokens = Math.min(this.maxTokens, this.tokens + newTokens);
      this.lastRefill = now;
    }
  }

  /**
   * Attempts to take tokens from the bucket
   * @param count Number of tokens to take
   * @returns True if tokens were successfully taken, false otherwise
   */
  takeTokens(count = 1): boolean {
    this.refill();
    
    if (this.tokens >= count) {
      this.tokens -= count;
      return true;
    }
    
    return false;
  }

  /**
   * Returns the current number of tokens in the bucket
   */
  getTokens(): number {
    this.refill();
    return this.tokens;
  }

  /**
   * Calculates the time in milliseconds until the specified number of tokens
   * will be available in the bucket
   * @param count Number of tokens needed
   * @returns Time in milliseconds until tokens will be available
   */
  getWaitTimeMs(count = 1): number {
    this.refill();
    
    const additionalTokensNeeded = Math.max(0, count - this.tokens);
    if (additionalTokensNeeded === 0) {
      return 0;
    }
    
    return Math.ceil(additionalTokensNeeded / this.refillRate);
  }
} 