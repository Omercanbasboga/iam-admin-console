# IAM Admin Console

A React admin console for managing OAuth2 **clients, users, roles, scopes, groups and sessions** — the frontend counterpart to [`sso-gateway-bff`](https://github.com/Omercanbasboga/sso-gateway-bff), the reactive OAuth2/OIDC BFF gateway. The browser never talks to the identity provider or holds a token directly; it only holds a same-site session cookie set by the gateway, and every API call goes through it.

This is a personal, generic reimplementation of the architecture and patterns from a production admin console I built and operated as part of a larger internal system. It is written from scratch for this repository — no proprietary code, credentials, branding, or infrastructure details from that project are included.

## A note on the UI layer

The original app was built on top of a commercial React admin template (Creative Tim's Soft UI Dashboard PRO). That template's code and design system are licensed and not open source, so none of it — components, theme, layout chrome — is reproduced here, regardless of the university-IP question. What you're looking at is a from-scratch layout and component set built directly on plain [MUI](https://mui.com/) (fully open source), preserving the same *architecture and interaction patterns* (tabbed detail views, server-aware data tables, dynamic list inputs, assignment checklists) without any of the original visual design or licensed code.

## What it does

- **Client management** — list all OAuth2 clients, drill into one, edit its redirect URIs, reveal/copy its client secret, and assign scopes and roles to it (`ClientList`, `ClientDetail`, tabs for General Info / Scopes / Roles).
- **User management** — list users (`UserList`), following the same table pattern.
- **Reusable assignment pattern** (`AssignmentTab`) — "assign these scopes/roles to this client" reduces to one component: fetch the full catalog plus the current assignment, render a checklist, PUT the updated set back. This is the same shape whether you're assigning scopes, roles, or groups, so it's written once and parameterized by `kind` rather than copy-pasted per entity.
- **Dynamic list editing** (`DynamicInputList`) — an add/remove list of plain-text values, used here for redirect URIs but generic enough for any open-ended list field.
- **A server-aware `DataTable`** built on `react-table` (sorting, global filter, optional server-side pagination) rendered with plain MUI `Table` components instead of a custom design system.
- **Session-cookie auth** — `SignIn` sends the browser to the gateway's `/oauth2/authorization/oidc` endpoint; `SignOut` hits the gateway's `/logout`. This app never sees a password or a token.

## Tech stack

- React 18, React Router 6
- MUI 5 (`@mui/material`, `@mui/icons-material`)
- `react-table` for the data table
- `axios` for API calls, with a response interceptor that redirects to sign-in on a 401
- SweetAlert2 for confirmation dialogs

## Project layout

```
src/
├── api/client.js                    # axios instance + 401 → sign-in redirect
├── layout/                          # Sidenav, Navbar, DashboardLayout
├── pages/sign-in/, sign-out/        # OIDC redirect pages (no credential forms)
├── components/DataTable/            # react-table + MUI wrapper
├── components/DynamicInputList/     # generic add/remove text-list input
└── features/
    ├── clients/                     # list, detail (tabs), create
    └── users/                       # list
```

## Running locally

```bash
npm install
cp .env.example .env   # point REACT_APP_API_BASE_URL at your backend, e.g. sso-gateway-bff
npm start
```

The dev server proxies `/api` requests — configure your own proxy or reverse proxy in front of the BFF gateway for local development.
