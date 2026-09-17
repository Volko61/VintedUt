# VintedUT — Convex + Convex Auth + React + Mantine

A hello-world full-stack app scaffolded with [`npm create convex`](https://www.npmjs.com/package/create-convex)
(React + Vite + Convex Auth template), then customized to use **Mantine** instead of Tailwind,
with **dark/light mode** and **fr/en localization**.

## Stack

- [Convex](https://convex.dev/) — database, server functions, realtime sync
- [Convex Auth](https://labs.convex.dev/auth) — email + password authentication
- [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- [Mantine 9](https://mantine.dev/) — UI components and theming
- [i18next](https://www.i18next.com/) + [react-i18next](https://react.i18next.com/) — fr/en localization

## Get started

This project uses **pnpm**.

```bash
pnpm install
pnpm dev
```

`pnpm dev` runs `convex dev` (which pushes functions and watches for changes) and starts Vite.

## Features

| Feature | Where |
| --- | --- |
| Email + password sign-in / sign-up | `src/components/SignInForm.tsx`, `convex/auth.ts` |
| Realtime hello messages | `convex/messages.ts`, `src/components/HelloBoard.tsx` |
| Dark / light / auto color scheme | `src/components/ColorSchemeToggle.tsx`, `src/main.tsx` |
| fr/en localization | `src/i18n/`, `src/components/LanguagePicker.tsx` |
| Mantine theme | `src/theme.ts` |

### Color scheme

`MantineProvider` is configured with `defaultColorScheme="auto"`, so the app follows the OS
setting until the user picks light or dark. The choice is persisted in `localStorage` under
`mantine-color-scheme-value`, and an inline script in `index.html` applies it before first paint
to avoid a flash of the wrong theme.

### Localization

Translations live in `src/i18n/locales/en.json` and `src/i18n/locales/fr.json`. The active
language is auto-detected from `localStorage` (key `vintedut-language`) then the browser, and is
persisted when changed. To add a language, add a locale file and append its code to
`SUPPORTED_LANGUAGES` in `src/i18n/index.ts`.

## Convex Auth environment variables

Convex Auth requires `SITE_URL`, `JWT_PRIVATE_KEY` and `JWKS` on the deployment. These are set by:

```bash
pnpx @convex-dev/auth --skip-git-check
```

## Learn more

- [Convex docs](https://docs.convex.dev/)
- [Convex Auth docs](https://labs.convex.dev/auth/)
- [Mantine docs](https://mantine.dev/)
- [Convex Discord community](https://convex.dev/community)
