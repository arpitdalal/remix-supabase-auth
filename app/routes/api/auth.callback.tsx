import { useEffect } from 'react';

import { setAuthSession } from '~/api/supabase-auth.server';
import { supabaseClient } from '~/services/supabase.client';
import { authCookie } from '~/services/supabase.server';

import type { ActionFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import {
  useFetcher,
  useSearchParams,
} from '@remix-run/react';
import type {
  AuthChangeEvent,
  Session,
} from '@supabase/supabase-js';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const formDataSession = formData.get("session") as string | null;
  const event = formData.get("event") as AuthChangeEvent | null;
  const redirectTo = String(formData.get("redirectTo")) || "/profile";
  if (!formDataSession || !event) {
    return redirect("/login");
  }
  const SupabaseSession: Session = JSON.parse(formDataSession);

  let session = await authCookie.getSession(request.headers.get("Cookie"));
  const { access_token: accessToken, refresh_token: refreshToken } =
    SupabaseSession;

  session = setAuthSession(session, accessToken, refreshToken || "");

  if (event === "SIGNED_IN") {
    return redirect(redirectTo, {
      headers: {
        "Set-Cookie": await authCookie.commitSession(session),
      },
    });
  } else if (event === "PASSWORD_RECOVERY") {
    return redirect("/change-password", {
      headers: {
        "Set-Cookie": await authCookie.commitSession(session),
      },
    });
  }
  redirect("/login");
};

export default function authCallback() {
  const fetcher = useFetcher();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        const formData = new FormData();
        formData.append("session", JSON.stringify(session));
        formData.append("event", event);
        formData.append(
          "redirectTo",
          searchParams.get("redirectTo") || "/profile"
        );

        fetcher.submit(formData, { method: "post" });
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, [fetcher, searchParams]);

  return null;
}
