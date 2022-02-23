# Remix Supabase Auth

Bare minimum and un-opinionated example using Remix to implement Supabase's email/password and social auth

## Features

- Signin and Register using Supabase's email/password, Google, and Facebook auth
- Persist user with HTTP cookie
- Refresh token logic implemented
- Can easily extend the social auth providers
- Bare minimum and un-opinionated
- `main` branch is Typescript but you can access JavaScript project in [`js` branch](https://github.com/arpitdalal/remix-supabase-auth/tree/js)

## Quick Start

- Create Supabase project (skip if you already have one):
  - Create [Supabase](https://app.supabase.io/) account
  - Create an Organization and a project
  - Visit API settings page of your project by either going to `https://app.supabase.io/project/<your-project-id>/settings/api` or clicking on the `Settings` on the left sidebar > click on `API` under `Project settings`. You'll find your `anon_key` and `URL` on that page, which will be used in the next step.
- Clone this example and rename/copy `.env.example` to `.env` and add `SUPABASE_ANON_KEY`, and `SUPABASE_URL`
- Add your Google and Facebook `client ID` and `secret` to your Supabase project, follow the steps mentioned in the Supabase's documentation for [Google](https://supabase.com/docs/guides/auth/auth-google) and [Facebook](https://supabase.com/docs/guides/auth/auth-facebook)
- Install npm dependencies by running `npm i`/`npm install` or `yarn`

## Development

- run the development server with `npm run dev` or `yarn dev`

## What you'll get?

[Register](./app/routes/register.tsx) - Register using email/password or continue with Google/Facebook social authentications

[Login](./app/routes/login.tsx) - Login using email/password or continue with Google/Facebook social authentications. When logging in using a Google/Facebook account that is not registered in Supabase, Supabase will create a new account with that email

[Profile](./app/routes/profile.tsx) - Only accessible when logged in, otherwise throws an error which is caught by Remix's `CatchBoundary` and asks user to login. Once logged in, it'll show the `User` object that is returned from Supabase

[Logout](./app/routes/api/logout.ts) - Logs user out of the local session and Supabase session. It is an api/resource route because it doesn't export a JSX element

## Questions?

Please feel free to hit me up on [Twitter](https://twitter.com/_arpit_dalal_) or opening an [Issue](https://github.com/arpitdalal/remix-supabase-auth/issues)

## License

MIT
