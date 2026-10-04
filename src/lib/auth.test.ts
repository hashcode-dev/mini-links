import { describe, expect, it, beforeEach, vi } from 'vitest';
import {
  clearAuthSession,
  getAuthSession,
  isAuthenticated,
  setAuthSession,
  subscribeAuth,
  type AuthSession,
} from './auth';

const sampleSession: AuthSession = {
  provider: 'google',
  accessToken: 'token-abc',
  user: {
    id: 'user-1',
    email: 'user@example.com',
    name: 'Test User',
  },
};

describe('auth session store', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns null when no session is stored', () => {
    expect(getAuthSession()).toBeNull();
    expect(isAuthenticated()).toBe(false);
  });

  it('persists and rehydrates a session', () => {
    setAuthSession(sampleSession);

    expect(getAuthSession()).toEqual(sampleSession);
    expect(isAuthenticated()).toBe(true);
  });

  it('clears the session on demand', () => {
    setAuthSession(sampleSession);
    clearAuthSession();

    expect(getAuthSession()).toBeNull();
    expect(isAuthenticated()).toBe(false);
  });

  it('recovers from a corrupt localStorage payload', () => {
    localStorage.setItem('mini-links-auth-session', '{not-json');

    expect(getAuthSession()).toBeNull();
    expect(localStorage.getItem('mini-links-auth-session')).toBeNull();
  });
});

describe('subscribeAuth', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('notifies listeners when a session is set', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeAuth(listener);

    setAuthSession(sampleSession);

    expect(listener).toHaveBeenCalledWith(sampleSession);
    unsubscribe();
  });

  it('notifies listeners with null when a session is cleared', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeAuth(listener);

    setAuthSession(sampleSession);
    clearAuthSession();

    expect(listener).toHaveBeenLastCalledWith(null);
    unsubscribe();
  });

  it('stops notifying after unsubscribe', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeAuth(listener);

    unsubscribe();
    setAuthSession(sampleSession);

    expect(listener).not.toHaveBeenCalled();
  });
});
