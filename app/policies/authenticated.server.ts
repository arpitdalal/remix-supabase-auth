import {
  getUserByAccessToken,
  hasActiveAuthSession,
  refreshUserToken,
  setAuthSession,
} from '~/api/supabase-auth.server';
import { authCookie } from '~/services/supabase.server';

import { redirect } from '@remix-run/node';
import type { User } from '@supabase/supabase-js';

export default async function authenticated(
  request: Request,
  successFunction: (user: User) => Response | Promise<Response>,
  failureFunction: () => Response | Promise<Response>,
  redirectTo?: string
): Promise<Response> {
  try {
    let session = await authCookie.getSession(request.headers.get("Cookie"));
    const url = new URL(request.url);
    const redirectUrl =
      redirectTo || `${url.origin}${url.pathname}${url.search}`;

    const isActiveAuthSession = await hasActiveAuthSession(session);
    if (!isActiveAuthSession) {
      const { accessToken, refreshToken, error } = await refreshUserToken(
        session
      );
      if (error || !accessToken || !refreshToken) {
        throw new Error("refreshUserToken " + error);
      }
      session = setAuthSession(session, accessToken, refreshToken);
      return redirect(redirectUrl, {
        headers: {
          "Set-Cookie": await authCookie.commitSession(session),
        },
      });
    }

    const { user, error: accessTokenError } = await getUserByAccessToken(
      session.get("access_token")
    );

    if (accessTokenError || !user || !user.email || !user.id) {
      throw new Error("getUserByAccessToken " + accessTokenError);
    }

    return await successFunction(user);
  } catch (error) {
    console.log(error); // You should log this error to your logging system
    return failureFunction();
  }
}
