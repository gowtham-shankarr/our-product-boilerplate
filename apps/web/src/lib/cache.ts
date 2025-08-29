// Cache management utilities

export interface CacheConfig {
  maxAge: number;
  staleWhileRevalidate?: number;
  tags?: string[];
}

export const CACHE_CONFIGS = {
  // Static assets - long cache
  STATIC: {
    maxAge: 31536000, // 1 year
    tags: ["static"],
  },

  // API responses - no cache
  API: {
    maxAge: 0,
    tags: ["api"],
  },

  // User data - short cache
  USER_DATA: {
    maxAge: 300, // 5 minutes
    staleWhileRevalidate: 60, // 1 minute
    tags: ["user"],
  },

  // Organization data - moderate cache
  ORG_DATA: {
    maxAge: 1800, // 30 minutes
    staleWhileRevalidate: 300, // 5 minutes
    tags: ["organization"],
  },

  // Public pages - moderate cache
  PUBLIC: {
    maxAge: 3600, // 1 hour
    staleWhileRevalidate: 1800, // 30 minutes
    tags: ["public"],
  },
} as const;

export function generateCacheKey(prefix: string, ...parts: string[]): string {
  return `${prefix}:${parts.join(":")}`;
}

export function getCacheControlHeader(config: CacheConfig): string {
  const parts = [`max-age=${config.maxAge}`];

  if (config.staleWhileRevalidate) {
    parts.push(`stale-while-revalidate=${config.staleWhileRevalidate}`);
  }

  return parts.join(", ");
}

export function getETag(content: string): string {
  // Simple ETag generation (use crypto in production)
  return `"${content.length.toString(16)}-${Date.now().toString(16)}"`;
}

export function validateETag(etag: string, content: string): boolean {
  const expectedETag = getETag(content);
  return etag === expectedETag;
}

// Cache invalidation helpers
export const CACHE_TAGS = {
  USER: "user",
  ORGANIZATION: "organization",
  INVITATION: "invitation",
  MEMBERSHIP: "membership",
  PROFILE: "profile",
  SETTINGS: "settings",
} as const;

export function getCacheTagsForUser(userId: string): string[] {
  return [
    `${CACHE_TAGS.USER}:${userId}`,
    `${CACHE_TAGS.PROFILE}:${userId}`,
    `${CACHE_TAGS.SETTINGS}:${userId}`,
  ];
}

export function getCacheTagsForOrganization(orgId: string): string[] {
  return [
    `${CACHE_TAGS.ORGANIZATION}:${orgId}`,
    `${CACHE_TAGS.MEMBERSHIP}:${orgId}`,
    `${CACHE_TAGS.INVITATION}:${orgId}`,
  ];
}
