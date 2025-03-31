/**
 * Calculates Levenshtein distance between two strings
 * Used for determining similarity between prompts for fuzzy caching
 * 
 * @param a First string
 * @param b Second string
 * @returns Distance value
 */
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  // Initializing the matrix
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = a[j - 1] === b[i - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Calculate similarity score between two strings (0 to 1)
 * 
 * @param a First string
 * @param b Second string
 * @returns Similarity score between 0 and 1
 */
export function calculateSimilarity(a: string, b: string): number {
  if (a === b) return 1.0;
  if (!a || !b) return 0.0;
  
  const distance = levenshteinDistance(a, b);
  const maxLength = Math.max(a.length, b.length);
  
  if (maxLength === 0) return 1.0;
  
  return 1 - distance / maxLength;
}

/**
 * Simple prompt normalization to improve cache hit rate
 * 
 * @param prompt Prompt string to normalize
 * @returns Normalized string
 */
export function normalizePrompt(prompt: string): string {
  return prompt
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
} 