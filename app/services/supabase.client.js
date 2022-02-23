import { name as appName } from 'package.json';
import { createClient } from '@supabase/supabase-js';

const supabaseOptions = {
  schema: "public",
  persistSession: true,
  autoRefreshToken: true,
  detectSessionInUrl: true,
  headers: { "x-application-name": appName },
};
const customWindow = window;
const supabaseUrl = customWindow.ENV.SUPABASE_URL;
const supabaseKey = customWindow.ENV.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, supabaseOptions);

export default supabase;
