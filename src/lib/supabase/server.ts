// server-side supabase client for server components and api routes
// uses @supabase/ssr with next.js 15 cookies api

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// note: we don't use the Database generic type here to avoid strict type checking
// issues during development. once supabase is fully set up, you can generate
// proper types using: npx supabase gen types typescript --project-id <your-project-id>

// create a supabase client for server-side usage
// this should be called fresh for each request to handle cookies properly
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
          } catch {
            // the `setAll` method is called from a server component
            // which throws when trying to set cookies
            // this can be ignored if middleware handles session refresh
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

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is required for admin operations'
    );
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
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
          } catch {
            // same as above - can be ignored if middleware handles refresh
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
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
          } catch {
            // ignored in server component context
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
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is required for admin operations'
    );
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
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
          } catch {
            // ignored in server component context
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
