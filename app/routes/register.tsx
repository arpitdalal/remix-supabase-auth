import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from 'remix';
import {
  Form,
  json,
  Link,
  redirect,
  useActionData,
} from 'remix';
import { registerUser } from '~/api/supabase-auth.server';
import AuthProviderBtn from '~/components/AuthProviderBtn';
import authenticated from '~/policies/authenticated.server';

export const meta: MetaFunction = () => {
  return { title: "Supabase x Remix | Register" };
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
  result?: string;
  fields?: { email: string };
};
export const action: ActionFunction = async ({
  request,
}): Promise<Response> => {
  const form = await request.formData();
  const email = form.get("email");
  const password = form.get("password");
  if (
    !email ||
    !password ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    password.length < 8
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

  const { user, error } = await registerUser({
    email,
    password,
  });
  if (error || !user) {
    return json<ActionData>(
      { formError: error || "Something went wrong", fields: { email } },
      401
    );
  }

  return json<ActionData>({ result: "success" }, { status: 201 });
};

export default function Register() {
  const actionData = useActionData<ActionData>();

  return (
    <div>
      <h1>Register</h1>
      <div style={{ margin: 5 }}>
        <AuthProviderBtn provider="google" />
      </div>
      <div style={{ margin: 5 }}>
        <AuthProviderBtn provider="facebook" />
      </div>
      <p>Or continue with email/password</p>
      <Form replace method="post">
        <fieldset>
          <legend>Register</legend>
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
              Password <input type="password" name="password" />
            </label>
          </div>
          <div style={{ margin: 5 }}>
            <button type="submit">Register</button>
          </div>
        </fieldset>
      </Form>
      <p>
        Have an account?<Link to="/login">Login</Link> instead
      </p>
      {actionData?.formError ? (
        <p style={{ color: "red" }}>{actionData.formError}</p>
      ) : null}
      {actionData?.result ? (
        <p style={{ color: "green" }}>
          We have sent you an email.
          <br />
          please confirm you email to complete registration.
        </p>
      ) : null}
    </div>
  );
}
