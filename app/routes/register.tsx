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
  doesUserExistByEmail,
  hasActiveAuthSession,
  registerUser,
} from '~/api/supabase-auth.server';
import AuthProviderBtn from '~/components/AuthProviderBtn';

export const meta: MetaFunction = () => {
  return { title: "Supabase x Remix | Register" };
};

export const loader: LoaderFunction = async ({ request }) => {
  if (await hasActiveAuthSession(request)) {
    return redirect("/profile");
  }
  return {};
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
  const redirectTo = form.get("redirectTo") || "/";
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

  if (await doesUserExistByEmail(email)) {
    return json<ActionData>(
      { formError: "Something went wrong", fields: { email } },
      400
    );
  }

  const { user, error } = await registerUser({
    email,
    password,
  });
  if (error || !user) {
    return json<ActionData>(
      { formError: error || "Something went wrong", fields: { email } },
      400
    );
  }

  return json<ActionData>({ result: "success" }, { status: 201 });
};

const Register = () => {
  const actionData = useActionData<ActionData>();
  const [searchParams] = useSearchParams();

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
        <input
          type="hidden"
          name="redirectTo"
          value={searchParams.get("redirectTo") ?? undefined}
        />
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
        Have an account? <Link to="/login">Login</Link> instead
      </p>
      {actionData?.formError ? (
        <p style={{ color: "red" }}>{actionData.formError}</p>
      ) : null}
      {actionData?.result ? (
        <p style={{ color: "green" }}>
          We have sent you an email, please confirm to register.
        </p>
      ) : null}
    </div>
  );
};

export default Register;
