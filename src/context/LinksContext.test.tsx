import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import type { ReactNode } from 'react';
import { LinksProvider, useLinks } from './LinksContext';
import { clearAuthSession, setAuthSession, type AuthSession } from '../lib/auth';

function wrapper({ children }: { children: ReactNode }) {
  return <LinksProvider>{children}</LinksProvider>;
}

const authedSession: AuthSession = {
  provider: 'email',
  user: { id: 'user-42', email: 'a@b.co', name: 'A B' },
};

describe('LinksProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    clearAuthSession();
  });

  it('starts empty for an anonymous subject', () => {
    const { result } = renderHook(() => useLinks(), { wrapper });
    expect(result.current.links).toEqual([]);
    expect(result.current.recentLinks).toEqual([]);
  });

  it('seeds the list for an authenticated subject with no stored data', () => {
    setAuthSession(authedSession);
    const { result } = renderHook(() => useLinks(), { wrapper });
    expect(result.current.links.length).toBeGreaterThan(0);
  });

  it('creates a link at the front of the list', () => {
    const { result } = renderHook(() => useLinks(), { wrapper });
    act(() => {
      result.current.createLink({
        originalUrl: 'https://example.com',
        domain: 'ml.dev',
        alias: 'Demo Alias!',
      });
    });
    expect(result.current.links[0].shortCode).toBe('demo-alias');
    expect(result.current.links[0].shortUrl).toBe('ml.dev/demo-alias');
    expect(result.current.links[0].originalUrl).toBe('https://example.com');
  });

  it('generates a fallback short code when no alias is supplied', () => {
    const { result } = renderHook(() => useLinks(), { wrapper });
    act(() => {
      result.current.createLink({
        originalUrl: 'https://example.com',
        domain: 'ml.dev',
      });
    });
    expect(result.current.links[0].shortCode).toMatch(/^lnk-[a-z0-9]+$/);
  });

  it('applies UTM params only when provided', () => {
    const { result } = renderHook(() => useLinks(), { wrapper });
    act(() => {
      result.current.createLink({
        originalUrl: 'https://example.com/path',
        domain: 'ml.dev',
        utmSource: 'twitter',
        utmCampaign: 'launch',
      });
    });
    const created = result.current.links[0];
    expect(new URL(created.originalUrl).searchParams.get('utm_source')).toBe('twitter');
    expect(new URL(created.originalUrl).searchParams.get('utm_campaign')).toBe('launch');
    expect(new URL(created.originalUrl).searchParams.has('utm_medium')).toBe(false);
  });

  it('preserves both links when createLink is called twice in a row', () => {
    const { result } = renderHook(() => useLinks(), { wrapper });
    act(() => {
      result.current.createLink({ originalUrl: 'https://a.example', domain: 'ml.dev', alias: 'a' });
      result.current.createLink({ originalUrl: 'https://b.example', domain: 'ml.dev', alias: 'b' });
    });
    expect(result.current.links.map((l) => l.shortCode).slice(0, 2)).toEqual(['b', 'a']);
  });

  it('marks password-protected links as Private', () => {
    const { result } = renderHook(() => useLinks(), { wrapper });
    act(() => {
      result.current.createLink({
        originalUrl: 'https://example.com',
        domain: 'ml.dev',
        passwordProtected: true,
      });
    });
    expect(result.current.links[0].status).toBe('Private');
    expect(result.current.links[0].passwordProtected).toBe(true);
  });

  it('updates a link by id', () => {
    setAuthSession(authedSession);
    const { result } = renderHook(() => useLinks(), { wrapper });
    const targetId = result.current.links[0].id;
    act(() => {
      result.current.updateLink(targetId, { clicks: 999 });
    });
    expect(result.current.getLinkById(targetId)?.clicks).toBe(999);
  });

  it('deletes a link by id', () => {
    setAuthSession(authedSession);
    const { result } = renderHook(() => useLinks(), { wrapper });
    const targetId = result.current.links[0].id;
    act(() => {
      result.current.deleteLink(targetId);
    });
    expect(result.current.getLinkById(targetId)).toBeUndefined();
  });

  it('caps anonymous storage at 10 links', () => {
    const { result } = renderHook(() => useLinks(), { wrapper });
    act(() => {
      for (let i = 0; i < 15; i++) {
        result.current.createLink({
          originalUrl: `https://example.com/${i}`,
          domain: 'ml.dev',
          alias: `k-${i}`,
        });
      }
    });
    expect(result.current.links).toHaveLength(10);
    expect(result.current.links[0].shortCode).toBe('k-14');
  });

  it('persists links to storage under a subject-scoped key', () => {
    setAuthSession(authedSession);
    const { result } = renderHook(() => useLinks(), { wrapper });
    act(() => {
      result.current.createLink({ originalUrl: 'https://x.example', domain: 'ml.dev', alias: 'x' });
    });
    const stored = localStorage.getItem('mini-links:v1:user-42:records');
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored ?? '[]');
    expect(parsed[0].shortCode).toBe('x');
  });

  it('rehydrates the list when the auth subject changes', () => {
    const { result } = renderHook(() => useLinks(), { wrapper });
    act(() => {
      result.current.createLink({ originalUrl: 'https://anon.example', domain: 'ml.dev', alias: 'anon-only' });
    });
    expect(result.current.links[0].shortCode).toBe('anon-only');

    act(() => {
      setAuthSession(authedSession);
    });
    expect(result.current.links.some((l) => l.shortCode === 'anon-only')).toBe(false);
    expect(result.current.links.length).toBeGreaterThan(0);

    act(() => {
      clearAuthSession();
    });
    expect(result.current.links[0].shortCode).toBe('anon-only');
  });

  it('falls back to defaults when stored data is corrupt', () => {
    setAuthSession(authedSession);
    localStorage.setItem('mini-links:v1:user-42:records', '{not-json');
    const { result } = renderHook(() => useLinks(), { wrapper });
    expect(result.current.links.length).toBeGreaterThan(0);
  });

  it('filters out invalid entries from a partially corrupt list', () => {
    setAuthSession(authedSession);
    localStorage.setItem(
      'mini-links:v1:user-42:records',
      JSON.stringify([{ id: 'bad' }, null, 'string']),
    );
    const { result } = renderHook(() => useLinks(), { wrapper });
    expect(result.current.links).toEqual([]);
  });

  it('returns undefined from getLinkById for unknown ids', () => {
    const { result } = renderHook(() => useLinks(), { wrapper });
    expect(result.current.getLinkById('does-not-exist')).toBeUndefined();
  });
});

describe('useLinks', () => {
  it('throws when used outside the provider', () => {
    expect(() => renderHook(() => useLinks())).toThrow(/inside LinksProvider/);
  });
});
