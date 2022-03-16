export function meta() {
  return { title: "Supabase x Remix | Home" };
}

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
