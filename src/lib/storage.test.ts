import { beforeEach, describe, expect, it } from 'vitest';
import { createSafeStorage } from './storage';

class ThrowingStorage implements Storage {
  length = 0;
  clear(): void {}
  key(): string | null {
    return null;
  }
  getItem(): string | null {
    throw new Error('nope');
  }
  setItem(): void {
    throw new Error('nope');
  }
  removeItem(): void {
    throw new Error('nope');
  }
}

describe('safeStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('reads and writes through the browser backend when available', () => {
    const storage = createSafeStorage(localStorage);
    storage.set('k', 'v');
    expect(storage.get('k')).toBe('v');
    storage.remove('k');
    expect(storage.get('k')).toBeNull();
  });

  it('returns null for unknown keys', () => {
    const storage = createSafeStorage(localStorage);
    expect(storage.get('missing')).toBeNull();
  });

  it('falls back to in-memory storage when no backend is provided', () => {
    const storage = createSafeStorage(null);
    storage.set('k', 'v');
    expect(storage.get('k')).toBe('v');
    storage.remove('k');
    expect(storage.get('k')).toBeNull();
  });

  it('falls back to in-memory storage when the backend throws', () => {
    const throwing = new ThrowingStorage() as unknown as globalThis.Storage;
    const storage = createSafeStorage(throwing);
    storage.set('k', 'v');
    expect(storage.get('k')).toBe('v');
    storage.remove('k');
    expect(storage.get('k')).toBeNull();
  });
});
