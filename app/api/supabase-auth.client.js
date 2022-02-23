import supabase from '~/services/supabase.client';

export const continueWithProvider = async ({
  provider,
  redirectTo = `${window.location.origin}/profile`,
}) => {
  return await supabase.auth.signIn(
    {
      provider,
    },
    {
      redirectTo: redirectTo,
    }
  );
};
