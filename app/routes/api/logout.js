import { redirect } from 'remix';
import { signOutUser } from '~/api/supabase-auth.server';
import {
  destroySession,
  getSession,
} from '~/services/supabase.server';

export const loader = () => {
  return redirect("/");
};

export const action = async ({ request }) => {
  let session = await getSession(request.headers.get("Cookie"));
  if (!session) {
    return redirect("/login");
  }

  const { done, error } = await signOutUser(session);
  if (error || !done) {
    console.log("Error signing out user in supabase", error);
  }

  return redirect("/login", {
    headers: { "Set-Cookie": await destroySession(session) },
  });
};
