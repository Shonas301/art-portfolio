// centralized env var validation
// throws descriptive errors when required vars are missing at startup

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`missing required environment variable: ${key}`);
  }
  return value;
}

function optional(key: string, fallback: string = ''): string {
  return process.env[key] ?? fallback;
}

// -- server-only env vars (never prefixed with NEXT_PUBLIC_) --

export const server = {
  get googleClientId() {
    return required('GOOGLE_CLIENT_ID');
  },
  get googleClientSecret() {
    return required('GOOGLE_CLIENT_SECRET');
  },
  get nextauthSecret() {
    return required('NEXTAUTH_SECRET');
  },
  get nextauthUrl() {
    return optional('NEXTAUTH_URL', 'http://localhost:3000');
  },
  get adminEmail() {
    return optional('ADMIN_EMAIL');
  },
  get supabaseServiceRoleKey() {
    return optional('SUPABASE_SERVICE_ROLE_KEY');
  },
} as const;

// -- public env vars (safe for client bundle) --

export const client = {
  get supabaseUrl() {
    return required('NEXT_PUBLIC_SUPABASE_URL');
  },
  get supabaseAnonKey() {
    return required('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  },
  get cloudinaryCloudName() {
    return optional('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME');
  },
} as const;
