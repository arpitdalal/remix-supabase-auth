import { redirect } from 'remix';
import {
  getUserByAccessToken,
  hasActiveAuthSession,
  refreshUserToken,
  setAuthSession,
} from '~/api/supabase-auth.server';
import { authCookie } from '~/services/supabase.server';

export default async function authenticated(
  request,
  successFunction,
  failureFunction,
  redirectTo
) {
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
      session = setAuthSession(request, accessToken, refreshToken);
      return redirect(redirectUrl, {
        headers: {
          "Set-Cookie": await authCookie.commitSession(session),
        },
      });
    }

    const { user, error: sessionErr } = await getUserByAccessToken(
      session.get("access_token")
    );

    if (sessionErr || !user || !user.email || !user.id) {
      throw new Error("getUserByAccessToken " + error);
    }

    return await successFunction(user);
  } catch (error) {
    console.log(error); // You should log this error to your logging system
    return failureFunction();
  }
}
