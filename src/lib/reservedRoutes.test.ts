import { describe, expect, it } from 'vitest';
import {
  RESERVED_APP_ROUTES,
  isReservedRoute,
  normalizeSlug,
  validateCustomAlias,
} from './reservedRoutes';

describe('reservedRoutes utility', () => {
  it('contains all core web application routes', () => {
    const expected = [
      'pricing',
      'about',
      'contact',
      'privacy-policy',
      'terms-of-service',
      'sitemap',
      'dashboard',
      'links',
      'qr',
      'auth',
    ];
    for (const route of expected) {
      expect(RESERVED_APP_ROUTES).toContain(route);
    }
  });

  describe('normalizeSlug', () => {
    it('normalizes slashes, spaces, and case', () => {
      expect(normalizeSlug('/Pricing/')).toBe('pricing');
      expect(normalizeSlug('  DASHBOARD  ')).toBe('dashboard');
      expect(normalizeSlug('///links///')).toBe('links');
      expect(normalizeSlug('')).toBe('');
    });
  });

  describe('isReservedRoute', () => {
    it('identifies exact reserved routes case-insensitively', () => {
      expect(isReservedRoute('pricing')).toBe(true);
      expect(isReservedRoute('PRICING')).toBe(true);
      expect(isReservedRoute('Dashboard')).toBe(true);
      expect(isReservedRoute('about')).toBe(true);
      expect(isReservedRoute('contact')).toBe(true);
      expect(isReservedRoute('privacy-policy')).toBe(true);
      expect(isReservedRoute('terms-of-service')).toBe(true);
      expect(isReservedRoute('sitemap')).toBe(true);
      expect(isReservedRoute('links')).toBe(true);
      expect(isReservedRoute('qr')).toBe(true);
      expect(isReservedRoute('auth')).toBe(true);
    });

    it('identifies subpaths of reserved routes', () => {
      expect(isReservedRoute('links/new')).toBe(true);
      expect(isReservedRoute('dashboard/analytics')).toBe(true);
      expect(isReservedRoute('assets/logo.png')).toBe(true);
    });

    it('returns false for non-reserved custom aliases', () => {
      expect(isReservedRoute('my-promo-2026')).toBe(false);
      expect(isReservedRoute('summer-sale')).toBe(false);
      expect(isReservedRoute('git-repo')).toBe(false);
      expect(isReservedRoute('custom123')).toBe(false);
      expect(isReservedRoute('')).toBe(false);
    });
  });

  describe('validateCustomAlias', () => {
    it('returns null for empty or undefined alias (automatic shortCode)', () => {
      expect(validateCustomAlias(undefined)).toBeNull();
      expect(validateCustomAlias(null)).toBeNull();
      expect(validateCustomAlias('')).toBeNull();
      expect(validateCustomAlias('   ')).toBeNull();
    });

    it('returns null for valid non-reserved alias', () => {
      expect(validateCustomAlias('spring-sale')).toBeNull();
      expect(validateCustomAlias('tech-conf-2026')).toBeNull();
    });

    it('returns error message for reserved web application aliases', () => {
      const result = validateCustomAlias('pricing');
      expect(result).toContain('reserved web application route');
      expect(result).toContain('pricing');

      expect(validateCustomAlias('DASHBOARD')).toContain('reserved web application route');
      expect(validateCustomAlias('/about/')).toContain('reserved web application route');
      expect(validateCustomAlias('links')).toContain('reserved web application route');
      expect(validateCustomAlias('auth')).toContain('reserved web application route');
    });
  });
});
