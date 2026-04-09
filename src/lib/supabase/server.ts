// server-side supabase client for server components and api routes
// uses @supabase/ssr with next.js 15 cookies api

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { client, server } from '@/lib/env';

// create a supabase client for server-side usage
// this should be called fresh for each request to handle cookies properly
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    client.supabaseUrl,
    client.supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (err) {
            // setAll called from server component context — can be ignored
            // if middleware handles session refresh
            console.error('supabase setAll cookie error (non-critical):', err);
          }
        },
      },
    }
  );
}

// create a supabase admin client with service role key
// use this for admin operations that bypass row level security
// warning: only use on the server, never expose to client
export async function createAdminClient() {
  const cookieStore = await cookies();

  const serviceRoleKey = server.supabaseServiceRoleKey;

  if (!serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is required for admin operations'
    );
  }

  return createServerClient(
    client.supabaseUrl,
    serviceRoleKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (err) {
            console.error('supabase admin setAll cookie error (non-critical):', err);
          }
        },
      },
      auth: {
        // disable auto-refresh for service role client
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

// create a client for api routes where cookies aren't async
// useful for route handlers in next.js 15
export function createRouteHandlerClient(
  cookieStore: Awaited<ReturnType<typeof cookies>>
) {
  return createServerClient(
    client.supabaseUrl,
    client.supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (err) {
            console.error('supabase route handler setAll cookie error (non-critical):', err);
          }
        },
      },
    }
  );
}

// admin client variant for route handlers
export function createRouteHandlerAdminClient(
  cookieStore: Awaited<ReturnType<typeof cookies>>
) {
  const serviceRoleKey = server.supabaseServiceRoleKey;

  if (!serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is required for admin operations'
    );
  }

  return createServerClient(
    client.supabaseUrl,
    serviceRoleKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (err) {
            console.error('supabase admin route handler setAll cookie error (non-critical):', err);
          }
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

// re-export database types for use in other files
export * from './types';
