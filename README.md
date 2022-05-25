# Remix Supabase Auth

Bare minimum and un-opinionated example using Remix to implement Supabase's email/password and social auth

## Features

- Signin and Register using Supabase's email/password, Google, and Facebook auth
- Change and reset password logic implemented
- Integration for all oAuth providers that Supabase supports
- Easily enable any oAuth provider - see [extend section](https://github.com/arpitdalal/remix-supabase-auth/tree/js#extend-implementation)
- Persist user with HTTP cookie
- Refresh token logic implemented
- Bare minimum and un-opinionated
- `js` branch is JavaScript but you can access Typescript project in [`main` branch](https://github.com/arpitdalal/remix-supabase-auth/)

## Quick Start

- Create Supabase project (skip if you already have one):
  - Create [Supabase](https://app.supabase.io/) account
  - Create an Organization and a project
- Visit API settings page of your project by either going to `https://app.supabase.io/project/<your-project-id>/settings/api` or clicking on the `Settings` on the left sidebar > click on `API` under `Project settings`. You'll find your `anon_key` and `URL` on that page, which will be used in the next step.
- Clone this example and rename/copy `.env.example` to `.env` and add `SUPABASE_ANON_KEY`, and `SUPABASE_URL`
- Add your Google and Facebook `client ID` and `secret` to your Supabase project, follow the steps mentioned in the Supabase's documentation for [Google](https://supabase.com/docs/guides/auth/auth-google) and [Facebook](https://supabase.com/docs/guides/auth/auth-facebook)
- Install npm dependencies by running `npm i`/`npm install`

## Development

- run the development server with `npm run dev`

## What you'll get?

[Register](./app/routes/register.jsx) - Register using email/password or continue with Google/Facebook social authentications

[Login](./app/routes/login.jsx) - Login using email/password or continue with Google/Facebook social authentications. When logging in using a Google/Facebook account that is not registered in Supabase, Supabase will create a new account with that email

[Forgot Password](./app/routes/forgot-password.jsx) - Takes user's email and sends a password reset email using `supabase.auth.api.resetPasswordForEmail`

[Auth Callback](./app/routes/api/auth.callback.jsx) - Handles the callback from Supabase when oAuth providers are used to login or register. This route uses `supabase.auth.onAuthStateChange` to get the access and refresh tokens from the url and then it submits the `FormData` to create session on the server

[Profile](./app/routes/profile.jsx) - Only accessible when logged in, otherwise throws an error which is caught by Remix's `CatchBoundary` and asks user to login. Once logged in, it'll show the `User` object that is returned from Supabase

[Change Password](./app/routes/change-password.jsx) - Takes in `password` and `confirm-password` to update user's password. This route requires user to be logged in or being redirected from `auth.callback.tsx` with the auth cookie in the flow of `PASSWORD_RECOVERY`

[Logout](./app/routes/api/logout.js) - Logs user out of the local session and Supabase session. It is an api/resource route because it doesn't export a JSX element

## Extend Implementation

<details>
<summary>Add other oAuth providers</summary>

- Simply add the `client ID` and `secret` to Supabase for the provider that you want to support.
- In `login.jsx` and `register.jsx` add the `<AuthProviderBtn provider={YourProvider} redirectTo={redirectTo} />` and that's it!
</details>

## Questions?

Please feel free to hit me up on [Twitter](https://twitter.com/_arpit_dalal_) or opening an [Issue](https://github.com/arpitdalal/remix-supabase-auth/issues)

## License

MIT
