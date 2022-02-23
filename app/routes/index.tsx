import { useEffect } from 'react';

import {
  MetaFunction,
  useNavigate,
} from 'remix';

export const meta: MetaFunction = () => {
  return { title: "Supabase x Remix | Home" };
};

export default function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    const modifiedUrl = document.location.href.replace("#", "?");
    const url = new URL(modifiedUrl);
    console.log("url", url);

    if (
      url.searchParams.get("access_token") &&
      url.searchParams.get("refresh_token")
    ) {
      console.log("Modified url", modifiedUrl);
      navigate(`/profile?${modifiedUrl.split("?")[1]}`);
      location.reload();
    }
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Supabase x Remix</h1>
      <h2>
        Bare minimum and un-opinionated example using Remix to implement
        Supabase's email/password and social auth.
      </h2>
    </div>
  );
}
