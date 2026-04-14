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

export function getAuthSession(): AuthSession | null {
  const rawSession = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession) as AuthSession;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function setAuthSession(session: AuthSession): void {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearAuthSession(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(getAuthSession());
}
