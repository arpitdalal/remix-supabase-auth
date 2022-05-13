import { signOutUser } from '~/api/supabase-auth.server';
import { authCookie } from '~/services/supabase.server';

import type {
  ActionFunction,
  LoaderFunction,
} from '@remix-run/node';
import { redirect } from '@remix-run/node';

export const loader: LoaderFunction = () => {
  return redirect("/");
};

export const action: ActionFunction = async ({ request }) => {
  let session = await authCookie.getSession(request.headers.get("Cookie"));
  if (!session) {
    return redirect("/login");
  }

  const { done, error } = await signOutUser(session);
  if (error || !done) {
    console.log("Error signing out user in supabase", error);
  }

  return redirect("/login", {
    headers: { "Set-Cookie": await authCookie.destroySession(session) },
  });
};

export default function Logout() {
  return null;
}
