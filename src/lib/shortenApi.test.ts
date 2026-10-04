import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  DEFAULT_SHORTEN_API_URL,
  DEFAULT_SHORTEN_REDIRECT_BASE,
  formatShortUrl,
  shortenUrl,
} from './shortenApi';

describe('shortenApi', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('formatShortUrl', () => {
    it('formats a short URL correctly with default base', () => {
      expect(formatShortUrl('test123')).toBe(`${DEFAULT_SHORTEN_REDIRECT_BASE}/test123`);
    });

    it('formats with custom base and trims trailing slash', () => {
      expect(formatShortUrl('test123', 'https://example.com/r/')).toBe('https://example.com/r/test123');
    });

    it('encodes special characters in short code', () => {
      expect(formatShortUrl('hello world')).toBe(`${DEFAULT_SHORTEN_REDIRECT_BASE}/hello%20world`);
    });
  });

  describe('shortenUrl', () => {
    it('throws validation error if URL is empty or invalid', async () => {
      await expect(shortenUrl({ originalUrl: '' })).rejects.toThrow('URL is required.');
      await expect(shortenUrl({ originalUrl: '   ' })).rejects.toThrow('URL is required.');
    });

    it('calls POST endpoint with valid body and returns parsed ShortenResult', async () => {
      const mockResponse = {
        shortUrl: 'testgcpurlv2',
        alias: 'testgcpurlv2',
        originalUrl: 'https://www.facebook.com',
        createdAt: '2026-10-04T16:48:37.205494245',
        clickCount: 0,
        active: true,
      };

      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => mockResponse,
      });
      vi.stubGlobal('fetch', fetchMock);

      const result = await shortenUrl({
        originalUrl: 'https://www.facebook.com',
        alias: 'testgcpurlv2',
      });

      expect(fetchMock).toHaveBeenCalledWith(
        DEFAULT_SHORTEN_API_URL,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            originalUrl: 'https://www.facebook.com',
            alias: 'testgcpurlv2',
          }),
        }),
      );

      expect(result.shortCode).toBe('testgcpurlv2');
      expect(result.alias).toBe('testgcpurlv2');
      expect(result.originalUrl).toBe('https://www.facebook.com');
      expect(result.fullShortUrl).toBe(`${DEFAULT_SHORTEN_REDIRECT_BASE}/testgcpurlv2`);
      expect(result.clickCount).toBe(0);
      expect(result.active).toBe(true);
      expect(result.raw).toEqual(mockResponse);
    });

    it('handles requests without alias by omitting alias field', async () => {
      const mockResponse = {
        shortUrl: 'autoKey7',
        alias: 'autoKey7',
        originalUrl: 'https://google.com',
        createdAt: '2026-10-04T16:48:40.000',
        clickCount: 0,
        active: true,
      };

      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => mockResponse,
      });
      vi.stubGlobal('fetch', fetchMock);

      const result = await shortenUrl({
        originalUrl: 'google.com',
      });

      expect(fetchMock).toHaveBeenCalledWith(
        DEFAULT_SHORTEN_API_URL,
        expect.objectContaining({
          body: JSON.stringify({
            originalUrl: 'https://google.com',
          }),
        }),
      );

      expect(result.shortCode).toBe('autoKey7');
    });

    it('handles minimal response missing optional fields gracefully', async () => {
      const mockResponse = {
        shortUrl: '',
        alias: '',
        originalUrl: '',
        createdAt: '',
        clickCount: undefined,
        active: undefined,
      };

      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => mockResponse,
      });
      vi.stubGlobal('fetch', fetchMock);

      const result = await shortenUrl({
        originalUrl: 'https://example.com/test',
        alias: 'fallbackAlias',
      });

      expect(result.shortCode).toBe('fallbackAlias');
      expect(result.alias).toBe('fallbackAlias');
      expect(result.originalUrl).toBe('https://example.com/test');
      expect(result.clickCount).toBe(0);
      expect(result.active).toBe(true);
    });

    it('translates 500 error when alias is provided to duplicate alias warning', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({
          status: 500,
          error: 'Internal Server Error',
        }),
      });
      vi.stubGlobal('fetch', fetchMock);

      await expect(
        shortenUrl({
          originalUrl: 'https://example.com',
          alias: 'alreadytaken',
        }),
      ).rejects.toThrow(/already be taken/i);
    });

    it('translates non-500 HTTP errors with error message', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({
          error: 'Invalid request body',
        }),
      });
      vi.stubGlobal('fetch', fetchMock);

      await expect(
        shortenUrl({
          originalUrl: 'https://example.com',
        }),
      ).rejects.toThrow('Shorten failed (400): Invalid request body');
    });

    it('handles non-JSON error response from backend', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: false,
        status: 502,
        json: async () => {
          throw new Error('Not JSON');
        },
        text: async () => 'Bad Gateway',
      });
      vi.stubGlobal('fetch', fetchMock);

      await expect(
        shortenUrl({
          originalUrl: 'https://example.com',
        }),
      ).rejects.toThrow('Shorten failed (502): Bad Gateway');
    });

    it('handles generic HTTP error without error payload', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
        json: async () => {
          throw new Error('Not JSON');
        },
        text: async () => '',
      });
      vi.stubGlobal('fetch', fetchMock);

      await expect(
        shortenUrl({
          originalUrl: 'https://example.com',
        }),
      ).rejects.toThrow('Shorten API failed with status 503');
    });

    it('supports custom apiUrl, redirectBase, and signal in options', async () => {
      const customController = new AbortController();
      const mockResponse = {
        shortUrl: 'customKey',
        alias: 'customKey',
        originalUrl: 'https://example.com/custom',
        createdAt: '2026-10-04T16:48:40.000',
        clickCount: 5,
        active: true,
      };

      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => mockResponse,
      });
      vi.stubGlobal('fetch', fetchMock);

      const result = await shortenUrl(
        { originalUrl: 'https://example.com/custom' },
        {
          apiUrl: 'https://my-custom-api.com/shorten',
          redirectBase: 'https://my-custom-api.com/r',
          signal: customController.signal,
        },
      );

      expect(fetchMock).toHaveBeenCalledWith(
        'https://my-custom-api.com/shorten',
        expect.objectContaining({
          method: 'POST',
        }),
      );
      expect(result.fullShortUrl).toBe('https://my-custom-api.com/r/customKey');
      expect(result.clickCount).toBe(5);
    });

    it('extracts error message from server response with message field', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({
          message: 'Original URL format is prohibited',
        }),
      });
      vi.stubGlobal('fetch', fetchMock);

      await expect(
        shortenUrl({
          originalUrl: 'https://example.com',
        }),
      ).rejects.toThrow('Shorten failed (400): Original URL format is prohibited');
    });

    it('handles already aborted signal', async () => {
      const controller = new AbortController();
      controller.abort();

      const fetchMock = vi.fn().mockImplementation((_url, opts) => {
        if (opts.signal?.aborted) {
          const err = new Error('Aborted');
          err.name = 'AbortError';
          return Promise.reject(err);
        }
        return Promise.resolve({ ok: true, json: async () => ({}) });
      });
      vi.stubGlobal('fetch', fetchMock);

      await expect(
        shortenUrl(
          { originalUrl: 'https://example.com' },
          { signal: controller.signal },
        ),
      ).rejects.toThrow('Request timed out. Please check your connection and try again.');
    });

    it('handles abort event fired on signal during request', async () => {
      const controller = new AbortController();

      const fetchMock = vi.fn().mockImplementation((_url, opts) => {
        return new Promise((_, reject) => {
          opts.signal?.addEventListener('abort', () => {
            const err = new Error('Aborted');
            err.name = 'AbortError';
            reject(err);
          });
        });
      });
      vi.stubGlobal('fetch', fetchMock);

      const promise = shortenUrl(
        { originalUrl: 'https://example.com' },
        { signal: controller.signal },
      );

      controller.abort();

      await expect(promise).rejects.toThrow('Request timed out. Please check your connection and try again.');
    });

    it('handles AbortError timeout', async () => {
      const abortError = new Error('The operation was aborted');
      abortError.name = 'AbortError';

      const fetchMock = vi.fn().mockRejectedValue(abortError);
      vi.stubGlobal('fetch', fetchMock);

      await expect(
        shortenUrl({
          originalUrl: 'https://example.com',
        }),
      ).rejects.toThrow('Request timed out. Please check your connection and try again.');
    });

    it('handles unknown non-Error rejections', async () => {
      const fetchMock = vi.fn().mockRejectedValue('network catastrophic error');
      vi.stubGlobal('fetch', fetchMock);

      await expect(
        shortenUrl({
          originalUrl: 'https://example.com',
        }),
      ).rejects.toThrow('An unexpected error occurred while shortening the URL.');
    });
  });
});
