import { useCallback } from 'react';

import { continueWithProvider } from '~/api/supabase-auth.client';
import type { Providers } from '~/types';

type AuthProviderBtnProps = {
  provider: Providers;
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;
const AuthProviderBtn = ({ provider, ...props }: AuthProviderBtnProps) => {
  const handleOnClick = useCallback(async () => {
    try {
      await continueWithProvider({ provider });
    } catch (error) {
      console.log(`error in continue with ${provider}`, error);

      // TODO: show error
      return;
    }
  }, [provider]);

  return (
    <button {...props} onClick={handleOnClick}>
      Continue with {provider}
    </button>
  );
};

export default AuthProviderBtn;
