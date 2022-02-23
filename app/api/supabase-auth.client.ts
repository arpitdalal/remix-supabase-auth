import supabase from '~/services/supabase.client';
import type { Providers } from '~/types';

type ContinueWithProviderArgs = {
  provider: Providers;
  redirectTo?: string;
};
export const continueWithProvider = async ({
  provider,
  redirectTo = `${window.location.origin}/profile`,
}: ContinueWithProviderArgs) => {
  return await supabase.auth.signIn(
    {
      provider,
    },
    {
      redirectTo: redirectTo,
    }
  );
};
