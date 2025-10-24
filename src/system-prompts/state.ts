import { UserSystemPrompt } from "@/system-prompts/type";

/**
 * Cached system prompts to avoid repeated file reads
 */
let cachedSystemPrompts: UserSystemPrompt[] = [];

/**
 * Update the cached system prompts
 */
export function updateCachedSystemPrompts(prompts: UserSystemPrompt[]): void {
  cachedSystemPrompts = prompts;
}

/**
 * Get the cached system prompts
 */
export function getCachedSystemPrompts(): UserSystemPrompt[] {
  return cachedSystemPrompts;
}

/**
 * Pending file writes to prevent infinite loops when modifying files
 */
const pendingFileWrites = new Set<string>();

/**
 * Add a file path to the pending writes set
 */
export function addPendingFileWrite(path: string): void {
  pendingFileWrites.add(path);
}

/**
 * Remove a file path from the pending writes set
 */
export function removePendingFileWrite(path: string): void {
  pendingFileWrites.delete(path);
}

/**
 * Check if a file path is in the pending writes set
 */
export function isPendingFileWrite(path: string): boolean {
  return pendingFileWrites.has(path);
}
