import authenticated from '~/policies/authenticated.server';

import { json } from '@remix-run/node';
import {
  Form,
  Link,
  useCatch,
  useLoaderData,
} from '@remix-run/react';

export function meta() {
  return { title: "Supabase x Remix | Profile" };
}

export async function loader({ request }) {
  return authenticated(
    request,
    (user) => {
      return json({ user });
    },
    () => {
      throw new Response("Unauthorized", { status: 401 });
    }
  );
}

export default function Profile() {
  const {user} = useLoaderData();

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Hello {user.email}!</h1>
      <Link to="/change-password">Change password</Link>
      <pre style={{ textAlign: "left" }}>
        <code>{JSON.stringify(user, null, 2)}</code>
      </pre>
      <Form method="post" action="/api/logout">
        <button type="submit">Logout</button>
      </Form>
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

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
}
