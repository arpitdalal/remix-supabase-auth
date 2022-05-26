import { resetPasswordForUser } from '~/api/supabase-auth.server';
import authenticated from '~/policies/authenticated.server';
import { authCookie } from '~/services/supabase.server';

import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  Form,
  Link,
  useActionData,
} from '@remix-run/react';

export const meta: MetaFunction = () => {
  return { title: "Supabase x Remix | Change password" };
};

export const loader: LoaderFunction = async ({ request }) => {
  return await authenticated(
    request,
    () => {
      return json({});
    },
    () => {
      throw new Response("Unauthorized", { status: 401 });
    }
  )
};

type ActionData = {
  message?: string;
  formError?: string;
}
export const action: ActionFunction = async ({ request }) => {
  return await authenticated(
    request,
    async () => {
      let session = await authCookie.getSession(request.headers.get("Cookie"));

      const form = await request.formData();

      const password = form.get("password");
      const confirmPassword = form.get("confirm-password");

      if (!password || !confirmPassword || typeof password !== "string" || typeof confirmPassword !== "string") {
        return json<ActionData>({
          formError: "Form not submitted correctly.",
        }, 403);
      }
      if (password !== confirmPassword) {
        return json<ActionData>({
          formError: "Passwords do not match.",
        }, 403);
      }

      const { user: newUser, error } = await resetPasswordForUser({
        password,
        session,
      });
      if (error || !newUser) {
        return json<ActionData>(
          { formError: error || "Something went wrong" },
          403
        );
      }

      return json<ActionData>({
        message: "Your password has successfully been reset.",
      });
    },
    () => {
      throw new Response("Unauthorized", { status: 401 });
    }
  )
};

export default function ChangePassword() {
  const actionData = useActionData<ActionData>();

  return (
    <div>
      <h1>Change password</h1>
      <Form method="post">
        <fieldset>
          <legend>Change password</legend>
          <div style={{ margin: 5 }}>
            <label>
              Password <input type="password" minLength={8} name="password" />
            </label>
          </div>
          <div style={{ margin: 5 }}>
            <label>
              Confirm password <input type="password" minLength={8} name="confirm-password" />
            </label>
          </div>
          <div style={{ margin: 5 }}>
            <button type="submit">Change password</button>
          </div>
        </fieldset>
      </Form>
      {actionData?.formError ? (
        <p style={{ color: "red" }}>{actionData.formError}</p>
      ) : null}
      {actionData?.message ? (
        <p style={{ color: "green" }}>{actionData.message} Go to your <Link to="/profile">profile</Link></p>
      ) : null}
    </div>
  )
}
