/**
 * Interface representing a queued request
 */
interface QueuedRequest<T = any> {
  id: string;
  prompt: string;
  resolve: (value: T) => void;
  reject: (reason: any) => void;
  options: any;
  timestamp: number;
}

/**
 * Function type for processing batched requests
 */
export type BatchProcessorFn<T = any> = (
  prompts: string[],
  optionsArray: any[]
) => Promise<T[]>;

/**
 * Options for configuring the request batcher
 */
export interface BatcherOptions {
  /**
   * Maximum items to include in a batch
   * @default 20
   */
  maxBatchSize?: number;
  
  /**
   * Maximum delay in milliseconds before processing a batch
   * @default 100
   */
  maxDelayMs?: number;
  
  /**
   * Maximum tokens to include in a batch
   * @default 4096
   */
  maxTokensPerBatch?: number;
  
  /**
   * Function to process batched requests
   */
  processBatchFn: BatchProcessorFn;
}

/**
 * Batches similar requests together to optimize API usage
 */
export class RequestBatcher<T = any> {
  private queue: QueuedRequest<T>[] = [];
  private maxBatchSize: number;
  private maxDelayMs: number;
  private maxTokensPerBatch: number;
  private batchTimer: ReturnType<typeof setTimeout> | null = null;
  private processBatchFn: BatchProcessorFn<T>;
  private isProcessing = false;
  private idCounter = 0;

  /**
   * Creates a new request batcher
   * @param options Configuration options
   */
  constructor(options: BatcherOptions) {
    this.maxBatchSize = options.maxBatchSize || 20;
    this.maxDelayMs = options.maxDelayMs || 100;
    this.maxTokensPerBatch = options.maxTokensPerBatch || 4096;
    this.processBatchFn = options.processBatchFn;
  }

  /**
   * Adds a request to the batch queue
   * @param prompt Prompt to process
   * @param options Additional options for the request
   * @returns Promise that resolves with the API response
   */
  async addRequest(prompt: string, options: any = {}): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const id = `req_${++this.idCounter}`;
      
      this.queue.push({
        id,
        prompt,
        resolve,
        reject,
        options,
        timestamp: Date.now()
      });
      
      // Start timer for this batch if not already running
      if (!this.batchTimer && !this.isProcessing) {
        this.batchTimer = setTimeout(() => this.processBatch(), this.maxDelayMs);
      }
      
      // Process immediately if we've reached max batch size
      if (this.queue.length >= this.maxBatchSize && !this.isProcessing) {
        clearTimeout(this.batchTimer!);
        this.batchTimer = null;
        this.processBatch();
      }
    });
  }

  /**
   * Processes the current batch of requests
   */
  private async processBatch(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) return;
    
    this.isProcessing = true;
    this.batchTimer = null;
    
    // Take items from the queue up to maxBatchSize
    const batch = this.queue.splice(0, this.maxBatchSize);
    
    try {
      const prompts = batch.map(item => item.prompt);
      const optionsArray = batch.map(item => item.options);
      
      // Process the batch
      const results = await this.processBatchFn(prompts, optionsArray);
      
      // Resolve each promise with its corresponding result
      batch.forEach((item, index) => {
        item.resolve(results[index]);
      });
    } catch (error) {
      // Reject all promises if the batch request fails
      batch.forEach(item => {
        item.reject(error);
      });
    } finally {
      this.isProcessing = false;
      
      // Check if there are more items in the queue
      if (this.queue.length > 0) {
        this.batchTimer = setTimeout(() => this.processBatch(), 0);
      }
    }
  }

  /**
   * Gets the current size of the request queue
   */
  get queueSize(): number {
    return this.queue.length;
  }

  /**
   * Clears the current request queue, rejecting all pending requests
   * @param reason Reason for rejecting the requests
   */
  clearQueue(reason: string = 'Queue cleared'): void {
    const error = new Error(reason);
    
    for (const request of this.queue) {
      request.reject(error);
    }
    
    this.queue = [];
    
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }
  }
} 