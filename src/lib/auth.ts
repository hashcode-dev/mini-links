import { safeStorage } from './storage';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export interface AuthSession {
  provider: 'google' | 'email';
  accessToken?: string;
  user: AuthUser;
}

const AUTH_STORAGE_KEY = 'mini-links-auth-session';

export type AuthListener = (session: AuthSession | null) => void;
const listeners = new Set<AuthListener>();

function emit(session: AuthSession | null): void {
  for (const listener of listeners) {
    listener(session);
  }
}

export function subscribeAuth(listener: AuthListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getAuthSession(): AuthSession | null {
  const raw = safeStorage.get(AUTH_STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    safeStorage.remove(AUTH_STORAGE_KEY);
    return null;
  }
}

export function setAuthSession(session: AuthSession): void {
  safeStorage.set(AUTH_STORAGE_KEY, JSON.stringify(session));
  emit(session);
}

export function clearAuthSession(): void {
  safeStorage.remove(AUTH_STORAGE_KEY);
  emit(null);
}

export function isAuthenticated(): boolean {
  return getAuthSession() !== null;
}
