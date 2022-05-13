import authenticated from '~/policies/authenticated.server';

import type {
  LoaderFunction,
  MetaFunction,
} from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  Form,
  Link,
  useCatch,
  useLoaderData,
} from '@remix-run/react';
import type { User } from '@supabase/supabase-js';

export const meta: MetaFunction = () => {
  return { title: "Supabase x Remix | Profile" };
};

type LoaderData = {
  user: User;
};
export const loader: LoaderFunction = async ({ request }) => {
  return authenticated(
    request,
    (user) => {
      return json<LoaderData>({ user });
    },
    () => {
      throw new Response("Unauthorized", { status: 401 });
    }
  );
};

export default function Profile() {
  const { user } = useLoaderData<LoaderData>();

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
