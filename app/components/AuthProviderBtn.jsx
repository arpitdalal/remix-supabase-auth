import { useCallback } from 'react';

import { continueWithProvider } from '~/api/supabase-auth.client';

export default function AuthProviderBtn({ provider, redirectTo, ...props }) {
  const handleOnClick = useCallback(async () => {
    try {
      await continueWithProvider({ provider, redirectTo });
    } catch (error) {
      console.log(`error in continue with ${provider}`, error);

      // You should show this error to user
      return;
    }
  }, [provider, redirectTo]);

  return (
    <button {...props} onClick={handleOnClick}>
      Continue with {provider}
    </button>
  );
}

