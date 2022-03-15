export type TypedWindow = Window &
  typeof globalThis & {
    ENV: {
      SUPABASE_URL: string;
      SUPABASE_ANON_KEY: string;
    };
  };

export type Error = { error?: string };
