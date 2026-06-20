# Route Protection Specification

## Purpose

Define client-side access control for protected pages and reverse access
control for auth pages, driven entirely by `useAuthStore.status`
(`'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error'`).
No middleware/proxy, no route groups, no `?from=` param, no role-based authz.

## Requirements

### Requirement: RequireAuth bootstrap and loading state

While the auth session has not yet resolved, `<RequireAuth>` MUST render a
loading state and MUST NOT redirect or render `children`.

#### Scenario: Idle status on mount

- GIVEN `useAuthStore` status is `'idle'`
- WHEN `<RequireAuth>` renders
- THEN a loading UI is rendered
- AND `router.replace` is NOT called
- AND `children` are NOT rendered

#### Scenario: Loading status during bootstrap

- GIVEN `useAuthStore` status is `'loading'`
- WHEN `<RequireAuth>` renders
- THEN a loading UI is rendered
- AND `router.replace` is NOT called
- AND `children` are NOT rendered

### Requirement: RequireAuth renders content for authenticated sessions

When the auth session has resolved to an authenticated user, `<RequireAuth>`
MUST render `children` and MUST NOT redirect.

#### Scenario: Authenticated status

- GIVEN `useAuthStore` status is `'authenticated'`
- WHEN `<RequireAuth>` renders
- THEN `children` are rendered
- AND `router.replace` is NOT called

### Requirement: RequireAuth redirects unauthenticated visitors

When the resolved session is unauthenticated, `<RequireAuth>` MUST redirect
to `/auth/login` using `router.replace` (not `push`) and MUST NOT render
`children`.

#### Scenario: Unauthenticated status

- GIVEN `useAuthStore` status is `'unauthenticated'`
- WHEN `<RequireAuth>` renders
- THEN `router.replace('/auth/login')` is called exactly once
- AND `children` are NOT rendered
- AND a non-content placeholder (loading UI or null) MAY be rendered while the redirect effect commits

#### Scenario: Redirect fires only once per resolved status

- GIVEN `useAuthStore` status is `'unauthenticated'`
- WHEN `<RequireAuth>` re-renders without a status change (e.g. parent re-render)
- THEN `router.replace('/auth/login')` is still called exactly once total

### Requirement: RequireAuth shows inline retry on session-fetch error

When the session fetch fails for a reason other than unauthorized (status
`'error'`), `<RequireAuth>` MUST render an inline error UI with a retry
control on the SAME route, MUST NOT redirect, and MUST NOT render `children`.

#### Scenario: Error status renders inline retry

- GIVEN `useAuthStore` status is `'error'`
- WHEN `<RequireAuth>` renders
- THEN an inline error message is displayed
- AND a retry control is rendered
- AND `router.replace` is NOT called
- AND `children` are NOT rendered

#### Scenario: Retry re-invokes session fetch

- GIVEN `useAuthStore` status is `'error'` and `<RequireAuth>` shows the retry control
- WHEN the user activates the retry control
- THEN `fetchCurrentUser()` is called

#### Scenario: Recovery after retry

- GIVEN the user activated retry from `'error'` status
- WHEN `useAuthStore` status transitions `'error'` -> `'loading'` -> `'authenticated'`
- THEN `<RequireAuth>` renders the loading UI during `'loading'`
- AND renders `children` once status becomes `'authenticated'`
- AND `router.replace` is never called during this sequence

#### Scenario: Retry resolves to unauthenticated

- GIVEN the user activated retry from `'error'` status
- WHEN `useAuthStore` status transitions `'error'` -> `'loading'` -> `'unauthenticated'`
- THEN `<RequireAuth>` renders the loading UI during `'loading'`
- AND calls `router.replace('/auth/login')` exactly once once status becomes `'unauthenticated'`

### Requirement: useRequireAuth hook exposes gate state

`useRequireAuth()` MUST expose the current auth `status` and a `retry`
callback bound to `fetchCurrentUser`, and MUST perform the redirect-on-
unauthenticated side effect described above. It MUST NOT itself render UI.

#### Scenario: Hook returns status and retry

- GIVEN any `useAuthStore` status
- WHEN `useRequireAuth()` is called
- THEN it returns the current `status`
- AND it returns a `retry` function that calls `fetchCurrentUser`

### Requirement: Reverse guard redirects authenticated users away from auth pages

`/auth/login` and `/auth/register` MUST redirect authenticated visitors to
`/dashboard` via `router.replace` and MUST NOT render the auth form in that
case.

#### Scenario: Authenticated visitor on /auth/login

- GIVEN `useAuthStore` status is `'authenticated'`
- WHEN `/auth/login` renders
- THEN `router.replace('/dashboard')` is called exactly once
- AND the login form is NOT rendered

#### Scenario: Authenticated visitor on /auth/register

- GIVEN `useAuthStore` status is `'authenticated'`
- WHEN `/auth/register` renders
- THEN `router.replace('/dashboard')` is called exactly once
- AND the register form is NOT rendered

### Requirement: Auth pages remain usable while unresolved or unauthenticated

`/auth/login` and `/auth/register` MUST render their form for every status
other than `'authenticated'` (`'idle'`, `'loading'`, `'unauthenticated'`,
`'error'`), without redirecting and without a blocking loading screen.

#### Scenario: Unauthenticated visitor sees the form

- GIVEN `useAuthStore` status is `'unauthenticated'`
- WHEN `/auth/login` (or `/auth/register`) renders
- THEN the form is rendered
- AND `router.replace` is NOT called

#### Scenario: Bootstrapping visitor sees the form, not a spinner

- GIVEN `useAuthStore` status is `'idle'` or `'loading'`
- WHEN `/auth/login` (or `/auth/register`) renders
- THEN the form is rendered (no full-page loading state blocks it)
- AND `router.replace` is NOT called

#### Scenario: Errored session check still allows form usage

- GIVEN `useAuthStore` status is `'error'`
- WHEN `/auth/login` (or `/auth/register`) renders
- THEN the form is rendered
- AND `router.replace` is NOT called

### Requirement: Reverse guard does not loop on status transitions

The reverse guard MUST issue `router.replace('/dashboard')` only once per
transition into `'authenticated'`, using `replace` (not `push`) to avoid
back-button loops.

#### Scenario: Transition from idle to authenticated

- GIVEN `useAuthStore` status starts at `'idle'` on `/auth/login`
- WHEN status transitions `'idle'` -> `'loading'` -> `'authenticated'`
- THEN the form renders during `'idle'` and `'loading'`
- AND `router.replace('/dashboard')` is called exactly once when status becomes `'authenticated'`

### Requirement: Protected pages apply RequireAuth

Each of the 9 protected pages (`/dashboard`, `/profile`, `/settings`,
`/game/[mode]`, `/leaderboard`, `/memory/verbal`, `/memory/visual-spatial`,
`/memory/visual-verbal`, `/memory/visual`, `/memory/working`) MUST wrap its
page body in `<RequireAuth>`.

#### Scenario: Protected page composition

- GIVEN any of the 9 protected pages
- WHEN the page module is rendered
- THEN its content is wrapped by `<RequireAuth>`
- AND the page-specific content only renders when status is `'authenticated'`

## Acceptance Criteria

- AC1: `'idle'`/`'loading'` -> loading UI, no redirect, no children (protected pages).
- AC2: `'authenticated'` -> children render, no redirect (protected pages).
- AC3: `'unauthenticated'` -> `router.replace('/auth/login')` exactly once, no children (protected pages).
- AC4: `'error'` -> inline error + retry, retry calls `fetchCurrentUser`, no redirect, no children (protected pages).
- AC5: `/auth/login` and `/auth/register` with `'authenticated'` -> `router.replace('/dashboard')` exactly once, form not rendered.
- AC6: `/auth/login` and `/auth/register` with any non-`'authenticated'` status -> form renders, no redirect.
- AC7: All redirects use `router.replace`; no redirect fires more than once per resolved status; status transitions during mount (e.g. `'loading'` -> `'authenticated'`, `'error'` -> `'loading'` -> `'unauthenticated'`) are handled without double-firing or stale redirects.
- AC8: All 9 protected pages compose `<RequireAuth>`; both auth pages compose the reverse guard.
