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
  useSearchParams,
} from 'remix';
import {
  hasActiveAuthSession,
  loginUser,
  setAuthSession,
} from '~/api/supabase-auth.server';
import AuthProviderBtn from '~/components/AuthProviderBtn';
import { commitSession } from '~/services/supabase.server';

export const meta: MetaFunction = () => {
  return { title: "Supabase x Remix | Login" };
};

export const loader: LoaderFunction = async ({ request }) => {
  if (await hasActiveAuthSession(request)) {
    return redirect("/profile");
  }
  return {};
};

type ActionData = {
  formError?: string;
  fields?: { email: string };
};
export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const email = form.get("email");
  const password = form.get("password");
  const redirectTo = form.get("redirectTo") || "/profile";
  if (
    !email ||
    !password ||
    typeof redirectTo !== "string" ||
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
      400
    );
  }

  const { accessToken, refreshToken, error } = await loginUser({
    email,
    password,
  });
  if (error || !accessToken || !refreshToken) {
    return json<ActionData>(
      { formError: error || "Something went wrong", fields: { email } },
      400
    );
  }

  const session = await setAuthSession(request, accessToken, refreshToken);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

const Login = () => {
  const actionData = useActionData<ActionData>();
  const [searchParams] = useSearchParams();

  return (
    <div>
      <h1>Login</h1>
      <div style={{ margin: 5 }}>
        <AuthProviderBtn provider="google" />
      </div>
      <div style={{ margin: 5 }}>
        <AuthProviderBtn provider="facebook" />
      </div>
      <p>Or continue with email/password</p>
      <Form replace method="post">
        <input
          type="hidden"
          name="redirectTo"
          value={searchParams.get("redirectTo") ?? undefined}
        />
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
};

export default Login;
