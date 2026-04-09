// browser-side supabase client for client components
// uses @supabase/ssr for next.js 15 compatibility

import { createBrowserClient } from '@supabase/ssr';
import { client } from '@/lib/env';
import type { Database } from './types';

// create a singleton supabase client for browser usage
// this client is safe to use in client components and handles auth automatically
export function createClient() {
  return createBrowserClient<Database>(
    client.supabaseUrl,
    client.supabaseAnonKey,
  );
}

// singleton instance for use across the app
// only created once per browser session
let browserClient: ReturnType<typeof createClient> | null = null;

export function getClient() {
  if (!browserClient) {
    browserClient = createClient();
  }
  return browserClient;
}

// re-export types for convenience
export type { Database } from './types';
