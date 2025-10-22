import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
  const cookieStore = cookies();

  // Define Supabase URL and Anon Key directly or use environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase URL or Anon Key");
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      // Use arrow function syntax for 'get'
      get: async (name: string) => {
        return (await cookieStore).get(name)?.value;
      },
      // Use arrow function syntax for 'set'
      set: async (name: string, value: string, options: CookieOptions) => {
        try {
          (await cookieStore).set({ name, value, ...options });
        } catch (error) {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
          // We can add a comment to satisfy ESLint about the unused 'error'
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const _ = error; // Assign to underscore if disabling isn't preferred
        }
      },
      // Use arrow function syntax for 'remove'
      remove: async (name: string, options: CookieOptions) => {
        try {
          (await cookieStore).set({ name, value: "", ...options });
        } catch (error) {
          // The `delete` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const _ = error; // Assign to underscore if disabling isn't preferred
        }
      },
    },
  });
}
