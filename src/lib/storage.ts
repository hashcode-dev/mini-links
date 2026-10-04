export interface SafeStorage {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}

function detectBrowserBackend(): globalThis.Storage | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const probe = '__mini-links-probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    return null;
  }
}

export function createSafeStorage(
  backend: globalThis.Storage | null = detectBrowserBackend(),
): SafeStorage {
  const memory = new Map<string, string>();

  return {
    get(key) {
      if (backend) {
        try {
          return backend.getItem(key);
        } catch {
          // fall through to memory
        }
      }
      return memory.get(key) ?? null;
    },
    set(key, value) {
      if (backend) {
        try {
          backend.setItem(key, value);
          return;
        } catch {
          // fall through to memory (quota, private mode, etc.)
        }
      }
      memory.set(key, value);
    },
    remove(key) {
      if (backend) {
        try {
          backend.removeItem(key);
        } catch {
          // fall through to memory
        }
      }
      memory.delete(key);
    },
  };
}

export const safeStorage: SafeStorage = createSafeStorage();
