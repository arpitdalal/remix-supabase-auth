import { name as appName } from 'package.json';
import type { TypedWindow } from '~/types';

import type { SupabaseClientOptions } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';

const supabaseOptions: SupabaseClientOptions = {
  schema: "public",
  persistSession: true,
  autoRefreshToken: true,
  detectSessionInUrl: true,
  headers: { "x-application-name": appName },
};
const customWindow = window as TypedWindow;
const supabaseUrl = customWindow.ENV.SUPABASE_URL;
const supabaseKey = customWindow.ENV.SUPABASE_ANON_KEY;

export const supabaseClient = createClient(
  supabaseUrl,
  supabaseKey,
  supabaseOptions
);
