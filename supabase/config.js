import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Client-side Supabase client (uses anon key, respects RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client (uses service role key, bypasses RLS)
// Only use in API routes / server-side code — NEVER import in components
export const getServiceSupabase = () => {
  if (typeof window !== "undefined") {
    throw new Error(
      "SECURITY: getServiceSupabase() cannot be called from client-side code. " +
      "Use the regular supabase client instead, or move this logic to an API route."
    );
  }
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY not available — only use getServiceSupabase server-side");
  }
  return createClient(supabaseUrl, serviceRoleKey);
};
