import { describe, expect, it } from 'vitest';
import { isHttpUrl, normalizeUrl, withUtmParams } from './url';

describe('isHttpUrl', () => {
  it('accepts http and https', () => {
    expect(isHttpUrl('http://example.com')).toBe(true);
    expect(isHttpUrl('https://example.com/path?q=1')).toBe(true);
  });

  it('rejects non-http schemes', () => {
    expect(isHttpUrl('ftp://example.com')).toBe(false);
    expect(isHttpUrl('javascript:alert(1)')).toBe(false);
    expect(isHttpUrl('httpxyz://example.com')).toBe(false);
  });

  it('rejects malformed input', () => {
    expect(isHttpUrl('not a url')).toBe(false);
    expect(isHttpUrl('')).toBe(false);
  });
});

describe('normalizeUrl', () => {
  it('leaves valid https URLs untouched', () => {
    expect(normalizeUrl('https://example.com/path')).toBe('https://example.com/path');
  });

  it('leaves valid http URLs untouched', () => {
    expect(normalizeUrl('http://example.com')).toBe('http://example.com');
  });

  it('adds https:// when the scheme is missing', () => {
    expect(normalizeUrl('example.com/path')).toBe('https://example.com/path');
  });

  it('trims surrounding whitespace', () => {
    expect(normalizeUrl('  https://example.com  ')).toBe('https://example.com');
  });

  it('throws on empty input', () => {
    expect(() => normalizeUrl('')).toThrow(/URL is required/);
    expect(() => normalizeUrl('   ')).toThrow(/URL is required/);
  });

  it('throws on invalid URLs', () => {
    expect(() => normalizeUrl('http://')).toThrow(/valid http/);
  });
});

describe('withUtmParams', () => {
  it('returns the original URL when no UTM values are supplied', () => {
    const url = 'https://example.com/path?ref=abc';
    expect(withUtmParams(url, {})).toBe(url);
  });

  it('preserves fragments and trailing slashes when no UTM values are supplied', () => {
    const url = 'https://example.com/path/#section';
    expect(withUtmParams(url, {})).toBe(url);
  });

  it('adds only the UTM keys that are provided', () => {
    const result = withUtmParams('https://example.com/x', { source: 'twitter' });
    const parsed = new URL(result);
    expect(parsed.searchParams.get('utm_source')).toBe('twitter');
    expect(parsed.searchParams.has('utm_medium')).toBe(false);
    expect(parsed.searchParams.has('utm_campaign')).toBe(false);
  });

  it('overwrites existing UTM keys', () => {
    const result = withUtmParams('https://example.com/?utm_source=old', {
      source: 'new',
      medium: 'social',
      campaign: 'launch',
    });
    const parsed = new URL(result);
    expect(parsed.searchParams.get('utm_source')).toBe('new');
    expect(parsed.searchParams.get('utm_medium')).toBe('social');
    expect(parsed.searchParams.get('utm_campaign')).toBe('launch');
  });
});
