export interface UtmParams {
  source?: string;
  medium?: string;
  campaign?: string;
}

const HTTP_PROTOCOLS = new Set(['http:', 'https:']);

export function isHttpUrl(url: string): boolean {
  try {
    return HTTP_PROTOCOLS.has(new URL(url).protocol);
  } catch {
    return false;
  }
}

export function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new Error('URL is required.');
  }
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  if (!isHttpUrl(candidate)) {
    throw new Error('Please enter a valid http or https URL.');
  }
  return candidate;
}

export function withUtmParams(url: string, utm: UtmParams): string {
  if (!utm.source && !utm.medium && !utm.campaign) {
    return url;
  }
  const parsed = new URL(url);
  if (utm.source) {
    parsed.searchParams.set('utm_source', utm.source);
  }
  if (utm.medium) {
    parsed.searchParams.set('utm_medium', utm.medium);
  }
  if (utm.campaign) {
    parsed.searchParams.set('utm_campaign', utm.campaign);
  }
  return parsed.toString();
}
