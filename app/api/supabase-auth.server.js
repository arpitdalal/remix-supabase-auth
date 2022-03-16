import { supabaseAdmin } from '~/services/supabase.server';

export async function setSBAuth(session) {
  const userAccessToken = session.get("access_token");
  supabaseAdmin.auth.setAuth(userAccessToken);
}

export function setAuthSession(session,
  accessToken,
  refreshToken) {
  session.set("access_token", accessToken);
  session.set("refresh_token", refreshToken);

  return session;
}

export async function hasAuthSession(session) {
  try {
    return session.has("access_token");
  } catch {
    return false;
  }
}

export async function hasActiveAuthSession(session) {
  try {
    if (!(await hasAuthSession(session)))
      return false;

    const { user, error } = await getUserByAccessToken(
      session.get("access_token")
    );

    if (error || !user)
      return false;
    return true;
  } catch {
    return false;
  }
}

export async function refreshUserToken(session) {
  try {
    const { data, error } = await supabaseAdmin.auth.api.refreshAccessToken(
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
}

export async function loginUser({
  email, password,
}) {
  try {
    const { data: sessionData, error: loginError } = await supabaseAdmin.auth.api.signInWithEmail(email, password);

    if (loginError ||
      !sessionData ||
      !sessionData.access_token ||
      !sessionData.refresh_token) {
      return { error: loginError?.message || "Something went wrong" };
    }

    return {
      accessToken: sessionData.access_token,
      refreshToken: sessionData.refresh_token,
    };
  } catch {
    return { error: "Something went wrong" };
  }
}

export async function registerUser({
  email, password,
}) {
  try {
    const { user, error: signUpError } = await supabaseAdmin.auth.signUp({
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
}

export async function signOutUser(session) {
  try {
    const { error } = await supabaseAdmin.auth.api.signOut(
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
}

export async function getUserByAccessToken(accessToken) {
  try {
    const { user, error } = await supabaseAdmin.auth.api.getUser(accessToken);

    if (error || !user) {
      return { error: error?.message || "Something went wrong" };
    }

    return { user };
  } catch {
    return {
      error: "Something went wrong",
    };
  }
}
