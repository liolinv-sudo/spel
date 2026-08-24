import { createClient } from "@supabase/supabase-js";

// Lovable injects these as project-level env vars once you connect a
// Supabase project. Here they're read the same way, from Vite's env.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Set them in a .env file (see .env.example)."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Note = {
  id: string;
  user_id: string;
  title: string;
  body: string;
  created_at: string;
};
