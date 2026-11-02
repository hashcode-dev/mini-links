/**
 * Canonical list of paths/slugs reserved by the web application.
 * Users cannot create custom shortened URL aliases matching any of these.
 */
export const RESERVED_APP_ROUTES = [
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
  'login',
  'signup',
  'logout',
  'assets',
  'api',
  'admin',
  'favicon.ico',
  'robots.txt',
  'sitemap.xml',
] as const;

export type ReservedRoute = (typeof RESERVED_APP_ROUTES)[number];

const RESERVED_SET = new Set<string>(
  RESERVED_APP_ROUTES.map((route) => route.toLowerCase()),
);

/**
 * Normalizes a route or alias candidate by stripping leading/trailing slashes,
 * trimming whitespace, and converting to lowercase.
 */
export function normalizeSlug(raw: string): string {
  return raw.trim().replace(/^\/+|\/+$/g, '').toLowerCase();
}

/**
 * Returns true if the given slug matches or starts with a reserved application route.
 */
export function isReservedRoute(rawSlug: string): boolean {
  const normalized = normalizeSlug(rawSlug);
  if (!normalized) {
    return false;
  }

  // Direct match (e.g. "pricing", "DASHBOARD")
  if (RESERVED_SET.has(normalized)) {
    return true;
  }

  // First segment match (e.g. "links/new", "assets/logo.png")
  const firstSegment = normalized.split('/')[0];
  return RESERVED_SET.has(firstSegment);
}

/**
 * Validates a custom alias input against reserved web application paths.
 * Returns an error message if invalid, or null if valid.
 */
export function validateCustomAlias(alias?: string | null): string | null {
  if (!alias) {
    return null;
  }

  const trimmed = alias.trim();
  if (!trimmed) {
    return null;
  }

  if (isReservedRoute(trimmed)) {
    return `The alias "${trimmed}" is a reserved web application route and cannot be used. Please choose a different alias.`;
  }

  return null;
}
