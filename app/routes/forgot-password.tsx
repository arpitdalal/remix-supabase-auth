import { useMemo } from 'react';

import { sendResetPasswordEmailForUser } from '~/api/supabase-auth.server';
import authenticated from '~/policies/authenticated.server';

import type {
  ActionFunction,
  LoaderFunction,
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

export const loader: LoaderFunction = async ({ request }) => {
  return authenticated(
    request,
    () => {
      return redirect("/profile");
    },
    () => {
      return json({});
    }
  );
};

type ActionData = {
  formError?: string;
  fields?: { email: string };
  message?: string;
};
export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const email = form.get("email");
  const redirectTo = form.get("redirectTo") || "/profile";
  if (
    !email ||
    typeof redirectTo !== "string" ||
    typeof email !== "string"
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

  try {
    await sendResetPasswordEmailForUser({
      email,
      redirectTo: `${new URL(request.url).origin}/api/auth/callback`,
    });
  } catch (error) {
    return json<ActionData>({
      formError: `Failed to send reset password email. Please try again.`,
      fields: {
        email: String(email) ?? "",
      },
    })
  }

  return json<ActionData>(
    {
      message: `An email has been sent to ${email} with a password reset link. Make sure to check your spam folder.`,
    },
  );
};

export default function ForgotPassword() {
  const actionData = useActionData<ActionData>();
  const [searchParams] = useSearchParams();

  const redirectTo = useMemo(
    () => searchParams.get("redirectTo") ?? "/profile",
    [searchParams]
  );

  return (
    <div>
      <h1>Reset Password</h1>
      <Form method="post">
        <fieldset>
          <legend>Reset password</legend>
          <p>Please enter your email address so we can send you the link to reset your password.</p>
          <div style={{ margin: 5 }}>
            <label>
              Email <input type="email" name="email" required />
            </label>
          </div>
          <div style={{ margin: 5 }}>
            <button type="submit">Reset password</button>
            <Link style={{ marginLeft: 10 }} to={`/login?redirectTo=${redirectTo}`}>Cancel</Link>
          </div>
        </fieldset>
      </Form>
      {actionData?.formError ? (
        <p style={{ color: "red" }}>{actionData.formError}</p>
      ) : null}
      {actionData?.message ? (
        <p style={{ color: "green" }}>{actionData.message}</p>
      ) : null}
    </div>
  )
}
