import { useEffect } from 'react';

import {
  Form,
  Link,
  useCatch,
  useLoaderData,
  useNavigate,
} from 'remix';
import authenticated from '~/policies/authenticated.server';

export const meta = () => {
  return { title: "Supabase x Remix | Profile" };
};

export const loader = async ({ request }) => {
  return await authenticated(request, ({ user }) => {
    return { user };
  });
};

const Profile = () => {
  const { user } = useLoaderData();

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Hello {user.email}!</h1>
      <pre style={{ textAlign: "left" }}>
        <code>{JSON.stringify(user, null, 2)}</code>
      </pre>
      <Form method="post" action="/api/logout">
        <button type="submit">Logout</button>
      </Form>
    </div>
  );
};

export default Profile;

export const CatchBoundary = () => {
  const caught = useCatch();
  const navigate = useNavigate();

  useEffect(() => {
    const modifiedUrl = document.location.href.replace("#", "?");
    const url = new URL(modifiedUrl);
    console.log("url", url);

    if (
      url.searchParams.get("access_token") &&
      url.searchParams.get("refresh_token")
    ) {
      console.log("Modified url", modifiedUrl);
      navigate(`/profile?${modifiedUrl.split("?")[1]}`);
      location.reload();
    }
  }, []);

  if (caught.status === 401) {
    return (
      <div>
        <h1>You are not logged in</h1>
        <p>
          Please <Link to="/login?redirectTo=profile">Login</Link>
        </p>
      </div>
    );
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
};