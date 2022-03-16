import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
  json,
} from "remix";

export function meta() {
  return {
    title: "Supabase x Remix",
    description:
      "Bare minimum and un-opinionated example using Remix to implement Supabase's email/password and social auth",
  };
}

export async function loader() {
  return json({
    ENV: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    },
  });
}

function Layout({ children }) {
  return (
    <div style={{ padding: "0 20px" }}>
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <header>
          <ul style={{ display: "flex", listStyleType: "none", padding: 0 }}>
            <li style={{ margin: 4 }}>
              <Link to='/'>Home</Link>
            </li>
            <li style={{ margin: 4 }}>
              <Link to='/login'>Login</Link>
            </li>
            <li style={{ margin: 4 }}>
              <Link to='/register'>Register</Link>
            </li>
            <li style={{ margin: 4 }}>
              <Link to='/profile'>Profile</Link>
            </li>
          </ul>
        </header>
        <main>{children}</main>
        <footer>
          <ul style={{ display: "flex", listStyleType: "none", padding: 0 }}>
            <li style={{ margin: 4 }}>
              <a
                target='_blank'
                rel='noopener noreferrer'
                href='https://github.com/arpitdalal/remix-supabase-auth'
              >
                Github
              </a>
            </li>
            <li style={{ margin: 4 }}>
              <a
                target='_blank'
                rel='noopener noreferrer'
                href='https://twitter.com/_arpit_dalal_'
              >
                Twitter
              </a>
            </li>
          </ul>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  const loaderData = useLoaderData();

  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body style={{ margin: 0 }}>
        <Layout>
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(loaderData?.ENV)}`,
          }}
        />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  switch (caught.status) {
    case 404: {
      return (
        <Layout>
          <div style={{ textAlign: "center" }}>
            <h1>Not Found</h1>
            <h2>Looks like the page you are looking for doesn't exist!</h2>
            <Link to='/'>Home page</Link>
          </div>
        </Layout>
      );
    }
    case 401: {
      return (
        <Layout>
          <div>
            <h1>You are not logged in</h1>
            <p>
              Please <Link to='/login'>Login</Link>
            </p>
          </div>
        </Layout>
      );
    }
  }

  return (
    <Layout>
      <div>
        <h1>Caught</h1>
        <p>Status: {caught.status}</p>
        <pre>
          <code>{JSON.stringify(caught.data, null, 2)}</code>
        </pre>
      </div>
    </Layout>
  );
}

export function ErrorBoundary({ error }) {
  return (
    <Layout>
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    </Layout>
  );
}
