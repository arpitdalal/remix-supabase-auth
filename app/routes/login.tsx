import { useMemo } from 'react';

import {
  loginUser,
  setAuthSession,
} from '~/api/supabase-auth.server';
import AuthProviderBtn from '~/components/AuthProviderBtn';
import authenticated from '~/policies/authenticated.server';
import { authCookie } from '~/services/supabase.server';

import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/node';
import {
  json,
  redirect,
} from '@remix-run/node';
import {
  Form,
  Link,
  useActionData,
  useSearchParams,
} from '@remix-run/react';

export const meta: MetaFunction = () => {
  return { title: "Supabase x Remix | Login" };
};

type LoaderData = {};
export const loader: LoaderFunction = async ({ request }) => {
  return authenticated(
    request,
    () => {
      return redirect("/profile");
    },
    () => {
      return json<LoaderData>({});
    }
  );
};

type ActionData = {
  formError?: string;
  fields?: { email: string };
};
export const action: ActionFunction = async ({ request }) => {
  let session = await authCookie.getSession(request.headers.get("Cookie"));

  const form = await request.formData();

  const email = form.get("email");
  const password = form.get("password");
  const redirectTo = form.get("redirectTo") || "/profile";
  if (
    !email ||
    !password ||
    typeof redirectTo !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return json<ActionData>(
      {
        formError: `Form not submitted correctly.`,
        fields: {
          email: String(email) ?? "",
        },
      },
      403
    );
  }

  const { accessToken, refreshToken, error } = await loginUser({
    email,
    password,
  });
  if (error || !accessToken || !refreshToken) {
    return json<ActionData>(
      { formError: error || "Something went wrong", fields: { email } },
      403
    );
  }

  session = setAuthSession(session, accessToken, refreshToken);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await authCookie.commitSession(session),
    },
  });
};

export default function Login() {
  const actionData = useActionData<ActionData>();
  const [searchParams] = useSearchParams();

  const redirectTo = useMemo(
    () => searchParams.get("redirectTo") ?? "/profile",
    [searchParams]
  );

  return (
    <div>
      <h1>Login</h1>
      <div style={{ margin: 5 }}>
        <AuthProviderBtn provider="google" redirectTo={redirectTo} />
      </div>
      <div style={{ margin: 5 }}>
        <AuthProviderBtn provider="facebook" redirectTo={redirectTo} />
      </div>
      <p>Or continue with email/password</p>
      <Form replace method="post">
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <fieldset>
          <legend>Login</legend>
          <div style={{ margin: 5 }}>
            <label>
              Email{" "}
              <input
                type="email"
                name="email"
                defaultValue={actionData?.fields?.email}
              />
            </label>
          </div>
          <div style={{ margin: 5 }}>
            <label>
              Password <input type="password" min={8} name="password" />
            </label>
          </div>
          <div style={{ margin: 5 }}>
            <button type="submit">Login</button>
          </div>
        </fieldset>
      </Form>
      <p>
        Don't have an account yet? <Link to="/register">Register</Link> instead
      </p>
      {actionData?.formError ? (
        <p style={{ color: "red" }}>{actionData.formError}</p>
      ) : null}
    </div>
  );
}
