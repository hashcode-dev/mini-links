import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { getAuthSession, subscribeAuth } from '../lib/auth';
import { safeStorage } from '../lib/storage';
import { withUtmParams } from '../lib/url';

export type LinkStatus = 'Active' | 'Expired' | 'Private';

export interface ShortLink {
  id: string;
  shortCode: string;
  domain: string;
  shortUrl: string;
  originalUrl: string;
  createdAt: string;
  clicks: number;
  status: LinkStatus;
  expiresAt?: string;
  passwordProtected: boolean;
}

export interface CreateLinkInput {
  originalUrl: string;
  domain: string;
  alias?: string;
  expiresAt?: string;
  passwordProtected?: boolean;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export interface LinksContextValue {
  links: ShortLink[];
  recentLinks: ShortLink[];
  createLink: (input: CreateLinkInput) => ShortLink;
  updateLink: (id: string, updates: Partial<ShortLink>) => void;
  deleteLink: (id: string) => void;
  getLinkById: (id: string) => ShortLink | undefined;
}

const LINKS_KEY_PREFIX = 'mini-links:v1';
const ANON_SUBJECT = 'anon';
const MAX_RECENT_LINKS = 10;

const seedLinks: ShortLink[] = [
  {
    id: '1',
    shortCode: 'git-repo',
    domain: 'lp.at',
    shortUrl: 'lp.at/git-repo',
    originalUrl: 'https://github.com/precision-atelier/core',
    createdAt: '2024-10-12T00:00:00.000Z',
    clicks: 1284,
    status: 'Active',
    passwordProtected: false,
  },
  {
    id: '2',
    shortCode: 'portfolio',
    domain: 'lp.at',
    shortUrl: 'lp.at/portfolio',
    originalUrl: 'https://dribbble.com/precision_links',
    createdAt: '2024-09-28T00:00:00.000Z',
    clicks: 4120,
    status: 'Active',
    passwordProtected: false,
  },
  {
    id: '3',
    shortCode: 'article-4',
    domain: 'lp.at',
    shortUrl: 'lp.at/article-4',
    originalUrl: 'https://medium.com/tech-insights/link-architecture',
    createdAt: '2024-08-15T00:00:00.000Z',
    clicks: 952,
    status: 'Expired',
    expiresAt: '2025-01-01',
    passwordProtected: false,
  },
  {
    id: '4',
    shortCode: 'wiki-internal',
    domain: 'lp.at',
    shortUrl: 'lp.at/wiki-internal',
    originalUrl: 'https://notion.so/atelier/internal-wiki',
    createdAt: '2024-11-02T00:00:00.000Z',
    clicks: 542,
    status: 'Private',
    passwordProtected: true,
  },
];

function subjectFor(userId: string | null | undefined): string {
  return userId ?? ANON_SUBJECT;
}

function currentSubject(): string {
  return subjectFor(getAuthSession()?.user.id);
}

function storageKeyFor(subject: string): string {
  return `${LINKS_KEY_PREFIX}:${subject}:records`;
}

function isValidLink(value: unknown): value is ShortLink {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const link = value as Partial<ShortLink>;
  return (
    typeof link.id === 'string' &&
    typeof link.shortCode === 'string' &&
    typeof link.domain === 'string' &&
    typeof link.shortUrl === 'string' &&
    typeof link.originalUrl === 'string' &&
    typeof link.createdAt === 'string' &&
    typeof link.clicks === 'number' &&
    typeof link.passwordProtected === 'boolean'
  );
}

function trimForSubject(subject: string, list: ShortLink[]): ShortLink[] {
  return subject === ANON_SUBJECT ? list.slice(0, MAX_RECENT_LINKS) : list;
}

function loadLinks(subject: string): ShortLink[] {
  const raw = safeStorage.get(storageKeyFor(subject));
  const fallback = subject === ANON_SUBJECT ? [] : seedLinks;
  if (raw === null) {
    return fallback;
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return fallback;
    }
    return trimForSubject(subject, parsed.filter(isValidLink));
  } catch {
    return fallback;
  }
}

function saveLinks(subject: string, list: ShortLink[]): void {
  safeStorage.set(storageKeyFor(subject), JSON.stringify(list));
}

function sanitizeAlias(alias: string): string {
  return alias
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export const LinksContext = createContext<LinksContextValue | undefined>(undefined);

export function LinksProvider({ children }: { children: ReactNode }) {
  const [subject, setSubject] = useState<string>(() => currentSubject());
  const [links, setLinks] = useState<ShortLink[]>(() => loadLinks(subject));

  const subjectRef = useRef(subject);
  useEffect(() => {
    subjectRef.current = subject;
  }, [subject]);

  const linksRef = useRef(links);
  useEffect(() => {
    linksRef.current = links;
  }, [links]);

  useEffect(() => {
    return subscribeAuth((session) => {
      const nextSubject = subjectFor(session?.user.id);
      setSubject(nextSubject);
      setLinks(loadLinks(nextSubject));
    });
  }, []);

  useEffect(() => {
    saveLinks(subject, links);
  }, [subject, links]);

  const createLink = useCallback((input: CreateLinkInput): ShortLink => {
    const alias = sanitizeAlias(input.alias ?? '');
    const shortCode = alias || `lnk-${Math.random().toString(36).slice(2, 8)}`;
    const domain = input.domain.trim();
    const newLink: ShortLink = {
      id: crypto.randomUUID(),
      shortCode,
      domain,
      shortUrl: `${domain}/${shortCode}`,
      originalUrl: withUtmParams(input.originalUrl, {
        source: input.utmSource,
        medium: input.utmMedium,
        campaign: input.utmCampaign,
      }),
      createdAt: new Date().toISOString(),
      clicks: 0,
      status: input.passwordProtected ? 'Private' : 'Active',
      expiresAt: input.expiresAt || undefined,
      passwordProtected: Boolean(input.passwordProtected),
    };

    setLinks((prev) => trimForSubject(subjectRef.current, [newLink, ...prev]));
    return newLink;
  }, []);

  const updateLink = useCallback((id: string, updates: Partial<ShortLink>) => {
    setLinks((prev) => prev.map((link) => (link.id === id ? { ...link, ...updates } : link)));
  }, []);

  const deleteLink = useCallback((id: string) => {
    setLinks((prev) => prev.filter((link) => link.id !== id));
  }, []);

  const getLinkById = useCallback((id: string) => {
    return linksRef.current.find((link) => link.id === id);
  }, []);

  const recentLinks = useMemo(() => {
    return [...links]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, MAX_RECENT_LINKS);
  }, [links]);

  const value = useMemo<LinksContextValue>(
    () => ({
      links,
      recentLinks,
      createLink,
      updateLink,
      deleteLink,
      getLinkById,
    }),
    [links, recentLinks, createLink, updateLink, deleteLink, getLinkById],
  );

  return <LinksContext.Provider value={value}>{children}</LinksContext.Provider>;
}

export function useLinks(): LinksContextValue {
  const context = useContext(LinksContext);
  if (!context) {
    throw new Error('useLinks must be used inside LinksProvider');
  }
  return context;
}
