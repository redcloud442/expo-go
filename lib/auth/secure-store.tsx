import * as SecureStore from "expo-secure-store";

/**
 * SecureStore adapter for Better Auth
 *
 * SecureStore doesn't allow colons in key names, but Better Auth uses
 * keys like "prefix:keyName". This adapter replaces colons with underscores.
 *
 * Valid SecureStore key characters: alphanumeric, ".", "-", "_"
 *
 * NOTE: Better Auth expects synchronous storage, but SecureStore is async.
 * This adapter uses an in-memory cache to provide sync access.
 */

const normalizeKey = (key: string): string => {
  // Replace colons with underscores to make keys compatible with SecureStore
  const normalized = key.replace(/:/g, "_");
  return normalized;
};

// In-memory cache for sync access
// Security Note: This cache stores tokens in plain memory for performance.
// The cache is:
// - Isolated to app's memory space (other apps cannot access)
// - Backed up to encrypted SecureStore
// - Cleared on logout (via removeItem)
// This is a recommended pattern for React Native auth tokens.
const cache = new Map<string, string | null>();

// Initialize cache from SecureStore on startup
const STORAGE_PREFIX = "expogo"; // Must match storagePrefix in auth-client
const COOKIE_KEY = `${STORAGE_PREFIX}_cookie`;
const SESSION_DATA_KEY = `${STORAGE_PREFIX}_session_data`;

// Pre-load critical keys into cache
(async () => {
  try {
    const cookie = await SecureStore.getItemAsync(COOKIE_KEY);
    const sessionData = await SecureStore.getItemAsync(SESSION_DATA_KEY);

    if (cookie) {
      cache.set(COOKIE_KEY, cookie);
    }
    if (sessionData) {
      cache.set(SESSION_DATA_KEY, sessionData);
    }
  } catch (error) {
    console.error("[SecureStore Adapter] Error pre-loading cache:", error);
  }
})();

export const secureStoreAdapter = {
  // Sync method that reads from cache (Better Auth expects sync)
  getItem: (key: string): string | null => {
    const normalizedKey = normalizeKey(key);
    return cache.get(normalizedKey) ?? null;
  },

  // Sync method that writes to cache AND async to SecureStore
  setItem: (key: string, value: string): void => {
    const normalizedKey = normalizeKey(key);

    // Update cache immediately (sync)
    cache.set(normalizedKey, value);

    // Persist to SecureStore in background (async)
    SecureStore.setItemAsync(normalizedKey, value).catch((error) => {
      console.error(
        "[SecureStore Adapter] Error persisting to SecureStore:",
        error
      );
    });
  },

  // Sync method that removes from cache AND async from SecureStore
  removeItem: (key: string): void => {
    const normalizedKey = normalizeKey(key);

    // Remove from cache immediately (sync)
    cache.delete(normalizedKey);

    // Remove from SecureStore in background (async)
    SecureStore.deleteItemAsync(normalizedKey).catch((error) => {
      console.error(
        "[SecureStore Adapter] Error removing from SecureStore:",
        error
      );
    });
  },
};

/**
 * Security utility: Clear all cached auth data from memory
 * Call this on logout or when auth is no longer needed
 */
export const clearAuthCache = () => {
  cache.clear();
};
