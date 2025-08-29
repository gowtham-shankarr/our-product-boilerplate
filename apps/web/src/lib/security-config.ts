// Security Configuration Documentation
// This file documents all security features implemented in the SaaS boilerplate

export const SECURITY_CONFIG = {
  // Authentication & Authorization
  AUTH: {
    // NextAuth.js configuration
    PROVIDERS: ["credentials", "google", "github"],
    SESSION_STRATEGY: "jwt",
    SESSION_MAX_AGE: 30 * 24 * 60 * 60, // 30 days
    PASSWORD_HASH_ROUNDS: 12,
  },

  // CSRF Protection
  CSRF: {
    TOKEN_LIFETIME: 24 * 60 * 60 * 1000, // 24 hours
    HEADER_NAME: "x-csrf-token",
    ONE_TIME_USE: true,
  },

  // Rate Limiting
  RATE_LIMIT: {
    GENERAL_WINDOW: 60 * 1000, // 1 minute
    GENERAL_MAX_REQUESTS: 100, // 100 requests per minute
    AUTH_WINDOW: 60 * 1000, // 1 minute
    AUTH_MAX_REQUESTS: 5, // 5 auth attempts per minute
  },

  // CORS Configuration
  CORS: {
    ALLOWED_ORIGINS: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://yourdomain.com", // Update for production
    ],
    ALLOWED_METHODS: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    ALLOWED_HEADERS: ["Content-Type", "Authorization", "x-csrf-token"],
    CREDENTIALS: true,
    MAX_AGE: 86400, // 24 hours
  },

  // Security Headers
  HEADERS: {
    // Frame Options
    X_FRAME_OPTIONS: "DENY",

    // Content Type Options
    X_CONTENT_TYPE_OPTIONS: "nosniff",

    // Referrer Policy
    REFERRER_POLICY: "strict-origin-when-cross-origin",

    // Permissions Policy
    PERMISSIONS_POLICY: "camera=(), microphone=(), geolocation=()",

    // Cross-Origin Policies
    COOP: "same-origin", // Cross-Origin Opener Policy
    COEP: "require-corp", // Cross-Origin Embedder Policy

    // HSTS
    HSTS: "max-age=31536000; includeSubDomains; preload",
  },

  // Content Security Policy
  CSP: {
    DEFAULT_SRC: ["'self'"],
    SCRIPT_SRC: ["'self'", "'unsafe-eval'", "'unsafe-inline'"],
    STYLE_SRC: ["'self'", "'unsafe-inline'"],
    IMG_SRC: ["'self'", "data:", "https:"],
    FONT_SRC: ["'self'"],
    CONNECT_SRC: ["'self'"],
    FRAME_ANCESTORS: ["'none'"],
    BASE_URI: ["'self'"],
    FORM_ACTION: ["'self'"],
  },

  // Caching Strategy
  CACHE: {
    STATIC_ASSETS: {
      maxAge: 31536000, // 1 year
      immutable: true,
    },
    API_ROUTES: {
      maxAge: 0,
      noStore: true,
      noCache: true,
    },
    AUTH_PAGES: {
      maxAge: 0,
      noStore: true,
    },
    DASHBOARD_PAGES: {
      maxAge: 0,
      private: true,
    },
    PUBLIC_PAGES: {
      maxAge: 3600, // 1 hour
      sMaxAge: 86400, // 24 hours CDN
    },
  },

  // Image Security
  IMAGES: {
    ALLOWED_DOMAINS: [
      "localhost",
      "yourdomain.com",
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
      "platform-lookaside.fbsbx.com",
      "res.cloudinary.com",
      "images.unsplash.com",
    ],
    FORMATS: ["image/webp", "image/avif"],
    OPTIMIZATION: true,
  },

  // Cookie Security
  COOKIES: {
    HTTP_ONLY: true,
    SAME_SITE: "lax",
    SECURE: "production", // true in production
    PATH: "/",
  },
} as const;

// Security checklist for production deployment
export const PRODUCTION_SECURITY_CHECKLIST = [
  "✅ Update CORS allowed origins with your domain",
  "✅ Update image domains with your trusted domains",
  "✅ Ensure HTTPS is enabled",
  "✅ Set secure environment variables",
  "✅ Enable database SSL/TLS",
  "✅ Configure proper logging and monitoring",
  "✅ Set up rate limiting with Redis (for scalability)",
  "✅ Configure backup and disaster recovery",
  "✅ Set up security monitoring and alerts",
  "✅ Regular security audits and updates",
  "✅ Enable 2FA for admin accounts",
  "✅ Set up proper error handling (no sensitive data in errors)",
  "✅ Configure proper session management",
  "✅ Set up audit logging for sensitive operations",
  "✅ Regular dependency updates and security patches",
] as const;

// Security testing commands
export const SECURITY_TEST_COMMANDS = {
  // Test CORS
  CORS_TEST: `
curl -H "Origin: http://malicious-site.com" \\
     -H "Access-Control-Request-Method: POST" \\
     -X OPTIONS https://yourdomain.com/api/organizations/create
  `,

  // Test Rate Limiting
  RATE_LIMIT_TEST: `
for i in {1..10}; do
  curl -X POST https://yourdomain.com/api/auth/signin \\
    -H "Content-Type: application/json" \\
    -d '{"email":"test@example.com","password":"password"}'
done
  `,

  // Test Security Headers
  HEADERS_TEST: `
curl -I https://yourdomain.com/
  `,

  // Test CSRF Protection
  CSRF_TEST: `
curl -X POST https://yourdomain.com/api/organizations/create \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Test Org"}'
  `,
} as const;
