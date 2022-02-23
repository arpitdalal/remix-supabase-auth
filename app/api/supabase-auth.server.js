import supabase, { getSession } from '~/services/supabase.server';

export const setSBAuth = async (request) => {
  const session = await getSession(request.headers.get("Cookie"));
  const userAccessToken = session.get("access_token");
  supabase.auth.setAuth(userAccessToken);
};

export const setAuthSession = async (
  request,
  accessToken,
  refreshToken
) => {
  const session = await getSession(request.headers.get("Cookie"));
  session.set("access_token", accessToken);
  session.set("refresh_token", refreshToken);

  return session;
};

export const hasAuthSession = async (request) => {
  try {
    const session = await getSession(request.headers.get("Cookie"));
    return session.has("access_token");
  } catch {
    return false;
  }
};

export const hasActiveAuthSession = async (
  request
)=> {
  try {
    if (!(await hasAuthSession(request))) return false;

    const session = await getSession(request.headers.get("Cookie"));
    const { user, error } = await getUserByAccessToken(
      session.get("access_token")
    );

    if (error || !user) return false;
    return true;
  } catch {
    return false;
  }
};

export const refreshUserToken = async (
  request
) => {
  try {
    const session = await getSession(request.headers.get("Cookie"));

    const { data, error } = await supabase.auth.api.refreshAccessToken(
      session.get("refresh_token")
    );

    if (error || !data || !data.access_token || !data.refresh_token) {
      return { error: error?.message || "Something went wrong" };
    }

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    };
  } catch {
    return { error: "Something went wrong" };
  }
};

export const loginUser = async ({
  email,
  password,
}) => {
  try {
    const { data: sessionData, error: loginError } =
      await supabase.auth.api.signInWithEmail(email, password);

    if (
      loginError ||
      !sessionData ||
      !sessionData.access_token ||
      !sessionData.refresh_token
    ) {
      return { error: loginError?.message || "Something went wrong" };
    }

    return {
      accessToken: sessionData.access_token,
      refreshToken: sessionData.refresh_token,
    };
  } catch {
    return { error: "Something went wrong" };
  }
};

export const registerUser = async ({
  email,
  password,
}) => {
  try {
    const { user, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError || !user) {
      return { error: signUpError?.message || "Something went wrong" };
    }

    return { user };
  } catch {
    return {
      error: "Something went wrong",
    };
  }
};

export const signOutUser = async (
  session
) => {
  try {
    const { error } = await supabase.auth.api.signOut(
      session.get("access_token")
    );
    if (error) {
      return { done: false, error: error?.message || "Something went wrong" };
    }
    return { done: true };
  } catch {
    return {
      done: false,
      error: "Something went wrong",
    };
  }
};

export const doesUserExistByEmail = async (email) => {
  try {
    const { data: profile, error } = await supabase
      .from<User>("users")
      .select("user_id")
      .eq("email", email)
      .single();

    if (error || !profile) return false;

    return true;
  } catch {
    return false;
  }
};

export const getUserByAccessToken = async (
  accessToken
) => {
  try {
    const { user, error } = await supabase.auth.api.getUser(accessToken);

    if (error || !user) {
      return { error: error?.message || "Something went wrong" };
    }

    return { user };
  } catch {
    return {
      error: "Something went wrong",
    };
  }
};
