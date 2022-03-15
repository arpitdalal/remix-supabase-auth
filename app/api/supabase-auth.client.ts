import { supabaseClient } from '~/services/supabase.client';

import type { Provider } from '@supabase/supabase-js';

type ContinueWithProviderArgs = {
  provider: Provider;
  redirectTo?: string;
};
export const continueWithProvider = async ({
  provider,
  redirectTo = "/profile",
}: ContinueWithProviderArgs) => {
  const redirectUrl = `${window.location.origin}/api/auth/callback?redirectTo=${redirectTo}`;

  return await supabaseClient.auth.signIn(
    {
      provider,
    },
    {
      redirectTo: redirectUrl,
    }
  );
};
