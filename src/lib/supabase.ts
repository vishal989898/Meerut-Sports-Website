import { createClient } from "@supabase/supabase-js";

// Supabase credentials provided
export const SUPABASE_URL = 
  import.meta.env.VITE_SUPABASE_URL || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 
  "https://zqooefwbmntaxzxtuubt.supabase.co";

export const SUPABASE_ANON_KEY = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
  "sb_publishable_2Lp7RK38Gg9oUI8JQlx3bA_BQ6Ryl-R";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);