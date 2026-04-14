import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

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

interface CreateLinkInput {
  originalUrl: string;
  domain: string;
  alias?: string;
  expiresAt?: string;
  passwordProtected?: boolean;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

interface LinksContextValue {
  links: ShortLink[];
  createLink: (input: CreateLinkInput) => ShortLink;
  updateLink: (id: string, updates: Partial<ShortLink>) => void;
  deleteLink: (id: string) => void;
  getLinkById: (id: string) => ShortLink | undefined;
}

const LINKS_STORAGE_KEY = 'mini-links-records';

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

function sanitizeAlias(alias: string): string {
  return alias.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

function withUtmParams(url: string, input: CreateLinkInput): string {
  const parsed = new URL(url);
  if (input.utmSource) {
    parsed.searchParams.set('utm_source', input.utmSource);
  }
  if (input.utmMedium) {
    parsed.searchParams.set('utm_medium', input.utmMedium);
  }
  if (input.utmCampaign) {
    parsed.searchParams.set('utm_campaign', input.utmCampaign);
  }
  return parsed.toString();
}

function loadInitialLinks(): ShortLink[] {
  const stored = localStorage.getItem(LINKS_STORAGE_KEY);
  if (!stored) {
    return seedLinks;
  }

  try {
    const parsed = JSON.parse(stored) as ShortLink[];
    if (!Array.isArray(parsed)) {
      return seedLinks;
    }
    return parsed;
  } catch {
    return seedLinks;
  }
}

const LinksContext = createContext<LinksContextValue | undefined>(undefined);

export function LinksProvider({ children }: { children: ReactNode }) {
  const [links, setLinks] = useState<ShortLink[]>(() => loadInitialLinks());

  const persist = (nextLinks: ShortLink[]) => {
    setLinks(nextLinks);
    localStorage.setItem(LINKS_STORAGE_KEY, JSON.stringify(nextLinks));
  };

  const createLink = (input: CreateLinkInput): ShortLink => {
    const createdAt = new Date().toISOString();
    const alias = sanitizeAlias(input.alias || '');
    const shortCode = alias || `lnk-${Math.random().toString(36).slice(2, 8)}`;
    const domain = input.domain.trim();
    const newLink: ShortLink = {
      id: crypto.randomUUID(),
      shortCode,
      domain,
      shortUrl: `${domain}/${shortCode}`,
      originalUrl: withUtmParams(input.originalUrl, input),
      createdAt,
      clicks: 0,
      status: input.passwordProtected ? 'Private' : 'Active',
      expiresAt: input.expiresAt || undefined,
      passwordProtected: Boolean(input.passwordProtected),
    };

    persist([newLink, ...links]);
    return newLink;
  };

  const updateLink = (id: string, updates: Partial<ShortLink>) => {
    persist(links.map((link) => (link.id === id ? { ...link, ...updates } : link)));
  };

  const deleteLink = (id: string) => {
    persist(links.filter((link) => link.id !== id));
  };

  const getLinkById = (id: string) => links.find((link) => link.id === id);

  const value = useMemo<LinksContextValue>(
    () => ({
      links,
      createLink,
      updateLink,
      deleteLink,
      getLinkById,
    }),
    [links],
  );

  return <LinksContext.Provider value={value}>{children}</LinksContext.Provider>;
}

export function useLinks() {
  const context = useContext(LinksContext);
  if (!context) {
    throw new Error('useLinks must be used inside LinksProvider');
  }
  return context;
}
