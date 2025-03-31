import { calculateSimilarity, normalizePrompt } from './utils/similarity';

/**
 * Interface for a cache entry
 */
export interface CacheEntry<T> {
  response: T;
  timestamp: number;
  prompt: string;
}

/**
 * Options for configuring the cache
 */
export interface CacheOptions {
  /**
   * Maximum number of items to keep in cache
   * @default 1000
   */
  maxSize?: number;
  
  /**
   * Time-to-live for cache entries in milliseconds
   * @default 3600000 (1 hour)
   */
  ttlMs?: number;
  
  /**
   * Threshold for considering prompts similar (0 to 1)
   * @default 0.95
   */
  similarityThreshold?: number;
  
  /**
   * Whether to enable fuzzy matching for cache lookups
   * @default true
   */
  enableFuzzyMatching?: boolean;
}

/**
 * Cache for AI API responses
 */
export class AICache<T = any> {
  private cache: Map<string, CacheEntry<T>>;
  private maxSize: number;
  private ttlMs: number;
  private similarityThreshold: number;
  private enableFuzzyMatching: boolean;

  /**
   * Creates a new AI cache
   * @param options Configuration options
   */
  constructor(options: CacheOptions = {}) {
    this.cache = new Map();
    this.maxSize = options.maxSize || 1000;
    this.ttlMs = options.ttlMs || 3600000; // Default 1 hour
    this.similarityThreshold = options.similarityThreshold || 0.95;
    this.enableFuzzyMatching = options.enableFuzzyMatching !== undefined 
      ? options.enableFuzzyMatching 
      : true;
  }

  /**
   * Gets a cached response for a prompt
   * @param prompt Prompt to look up
   * @returns Cached response or null if not found
   */
  get(prompt: string): T | null {
    const normalizedPrompt = normalizePrompt(prompt);
    
    // Exact match check
    if (this.cache.has(normalizedPrompt)) {
      const entry = this.cache.get(normalizedPrompt)!;
      if (Date.now() - entry.timestamp < this.ttlMs) {
        return entry.response;
      } else {
        this.cache.delete(normalizedPrompt); // Entry expired
      }
    }
    
    // Similar match check
    if (this.enableFuzzyMatching && this.similarityThreshold < 1.0) {
      for (const [key, entry] of this.cache.entries()) {
        if (Date.now() - entry.timestamp >= this.ttlMs) {
          this.cache.delete(key);
          continue;
        }
        
        const similarity = calculateSimilarity(normalizedPrompt, key);
        if (similarity >= this.similarityThreshold) {
          return entry.response;
        }
      }
    }
    
    return null;
  }

  /**
   * Stores a response in the cache
   * @param prompt Prompt that generated the response
   * @param response Response to cache
   */
  set(prompt: string, response: T): void {
    const normalizedPrompt = normalizePrompt(prompt);
    
    // Evict oldest entry if cache is full
    if (this.cache.size >= this.maxSize && !this.cache.has(normalizedPrompt)) {
      // Find oldest entry
      let oldestKey: string | null = null;
      let oldestTime = Infinity;
      
      for (const [key, entry] of this.cache.entries()) {
        if (entry.timestamp < oldestTime) {
          oldestTime = entry.timestamp;
          oldestKey = key;
        }
      }
      
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }
    
    this.cache.set(normalizedPrompt, {
      response,
      timestamp: Date.now(),
      prompt: normalizedPrompt
    });
  }

  /**
   * Clears all entries from the cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Removes expired entries from the cache
   * @returns Number of entries removed
   */
  purgeExpired(): number {
    let purgedCount = 0;
    const now = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp >= this.ttlMs) {
        this.cache.delete(key);
        purgedCount++;
      }
    }
    
    return purgedCount;
  }

  /**
   * Gets the number of entries in the cache
   */
  get size(): number {
    return this.cache.size;
  }
} 