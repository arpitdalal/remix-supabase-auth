import { signOutUser } from '~/api/supabase-auth.server';
import { authCookie } from '~/services/supabase.server';

import { redirect } from '@remix-run/node';

export function loader() {
  return redirect("/");
}

export async function action({ request }) {
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
}

export default function Logout() {
  return null;
}
