import { redirect } from 'remix';
import {
  getUserByAccessToken,
  hasActiveAuthSession,
  refreshUserToken,
  setAuthSession,
} from '~/api/supabase-auth.server';
import {
  commitSession,
  getSession,
} from '~/services/supabase.server';

export default async function authenticated(
  request,
  callback
) {
  try {
    const url = new URL(request.url);
    const accessToken = url.searchParams.get("access_token");
    const refreshToken = url.searchParams.get("refresh_token");

    if (accessToken && refreshToken) {
      const session = await setAuthSession(request, accessToken, refreshToken);

      return redirect("/profile", {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }

    const isActiveAuthSession = await hasActiveAuthSession(request);
    if (!isActiveAuthSession) {
      const { accessToken, refreshToken, error } = await refreshUserToken(
        request
      );
      if (error || !accessToken || !refreshToken) {
        throw new Response("Unauthorized", { status: 401 });
      }
      const session = await setAuthSession(request, accessToken, refreshToken);
      return redirect("/", {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }

    const session = await getSession(request.headers.get("Cookie"));
    const { user, error: sessionErr } = await getUserByAccessToken(
      session.get("access_token")
    );

    if (sessionErr || !user || !user.email || !user.id) {
      throw new Response("Unauthorized", { status: 401 });
    }

    return await callback({ user });
  } catch {
    throw new Response("Unauthorized", { status: 401 });
  }
}
