import { normalizeUrl } from './url';

export const DEFAULT_SHORTEN_API_URL =
  'https://shorten-url-67086831017.asia-south1.run.app/shorten';
export const DEFAULT_SHORTEN_REDIRECT_BASE =
  'https://shorten-url-67086831017.asia-south1.run.app/r';

export interface ShortenApiRequest {
  originalUrl: string;
  alias?: string;
}

export interface ShortenApiResponse {
  shortUrl: string;
  alias: string;
  originalUrl: string;
  createdAt: string;
  clickCount: number;
  lastClickedAt?: string;
  active: boolean;
  reportMalicious?: boolean;
  ipAddressMap?: Record<string, number>;
  countryClickMap?: Record<string, number> | null;
  deviceInfoList?: unknown[] | null;
  [key: string]: unknown;
}

export interface ShortenResult {
  shortCode: string;
  alias: string;
  originalUrl: string;
  fullShortUrl: string;
  createdAt: string;
  clickCount: number;
  active: boolean;
  raw: ShortenApiResponse;
}

export interface ShortenOptions {
  apiUrl?: string;
  redirectBase?: string;
  timeoutMs?: number;
  signal?: AbortSignal;
}

export function formatShortUrl(shortCode: string, redirectBase = DEFAULT_SHORTEN_REDIRECT_BASE): string {
  const cleanBase = redirectBase.replace(/\/+$/, '');
  const cleanCode = encodeURIComponent(shortCode.trim());
  return `${cleanBase}/${cleanCode}`;
}

/**
 * Call the remote backend REST API to shorten a long URL.
 * Method: POST
 * URI: https://shorten-url-67086831017.asia-south1.run.app/shorten
 */
export async function shortenUrl(
  input: ShortenApiRequest,
  options: ShortenOptions = {},
): Promise<ShortenResult> {
  const normalizedOriginalUrl = normalizeUrl(input.originalUrl);

  const endpoint =
    options.apiUrl ||
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SHORTEN_API_URL) ||
    DEFAULT_SHORTEN_API_URL;

  const redirectBase =
    options.redirectBase ||
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SHORTEN_REDIRECT_BASE) ||
    DEFAULT_SHORTEN_REDIRECT_BASE;

  const trimmedAlias = input.alias?.trim();
  const requestBody: { originalUrl: string; alias?: string } = {
    originalUrl: normalizedOriginalUrl,
  };

  if (trimmedAlias) {
    requestBody.alias = trimmedAlias;
  }

  const timeoutMs = options.timeoutMs ?? 15000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  if (options.signal) {
    if (options.signal.aborted) {
      controller.abort();
    } else {
      options.signal.addEventListener('abort', () => controller.abort(), { once: true });
    }
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let serverErrorText = '';
      try {
        const errorJson = await response.json();
        serverErrorText = errorJson.message || errorJson.error || '';
      } catch {
        // Fallback to text if JSON parsing fails
        serverErrorText = await response.text().catch(() => '');
      }

      if (response.status === 500 && trimmedAlias) {
        throw new Error(
          `Failed to shorten URL. The alias "${trimmedAlias}" may already be taken or invalid. Please try a different alias or leave it empty.`,
        );
      }

      if (serverErrorText) {
        throw new Error(`Shorten failed (${response.status}): ${serverErrorText}`);
      }

      throw new Error(`Shorten API failed with status ${response.status}`);
    }

    const data = (await response.json()) as ShortenApiResponse;
    const shortCode = data.shortUrl || data.alias || trimmedAlias || '';
    const fullShortUrl = formatShortUrl(shortCode, redirectBase);

    return {
      shortCode,
      alias: data.alias || shortCode,
      originalUrl: data.originalUrl || normalizedOriginalUrl,
      fullShortUrl,
      createdAt: data.createdAt || new Date().toISOString(),
      clickCount: typeof data.clickCount === 'number' ? data.clickCount : 0,
      active: data.active ?? true,
      raw: data,
    };
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please check your connection and try again.');
      }
      throw error;
    }

    throw new Error('An unexpected error occurred while shortening the URL.');
  }
}
