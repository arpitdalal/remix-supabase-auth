import { supabaseClient } from '~/services/supabase.client';

export const continueWithProvider = async ({
  provider,
  redirectTo = "/profile",
}) => {
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
