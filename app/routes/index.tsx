import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return { title: "Supabase x Remix | Home" };
};

export default function Index() {
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
