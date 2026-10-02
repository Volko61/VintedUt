# Deploying VintedUT on Dokploy

The app has two parts:

| Part | What it is | Where it runs |
| --- | --- | --- |
| Frontend | Static Vite/React SPA (`dist/`) | Dokploy app built from the repo's `Dockerfile` (nginx) |
| Backend | Convex functions + database (`convex/`) | **Option A:** Convex Cloud · **Option B:** self-hosted Convex on Dokploy |

The `Dockerfile` runs `npx convex deploy --cmd "pnpm run build"`, which pushes the
`convex/` functions and then builds the frontend with `VITE_CONVEX_URL` set to the
right deployment. Each Dokploy deploy therefore updates the backend and the frontend together.

---

## Option A — Convex Cloud backend + Dokploy frontend (simplest)

### 1. Prepare the Convex production deployment
1. Run `pnpm dev` once locally (creates the project and dev deployment).
2. In the Convex dashboard → your project → **Production** → *Settings* → **Generate Production Deploy Key**.
3. Set the Convex Auth secrets on **prod**:
   ```bash
   npx @convex-dev/auth --prod
   ```
   This sets `JWT_PRIVATE_KEY` and `JWKS`. Then set the site URL (your Dokploy domain):
   ```bash
   npx convex env set SITE_URL https://vintedut.example.com --prod
   ```

### 2. Create the app in Dokploy
1. **Projects → Create Project → Create Service → Application.**
2. **General → Provider:** GitHub → repo `Volko61/VintedUt`, branch `master`.
3. **Build Type:** `Dockerfile` (path `Dockerfile`, context `.`).
4. **Environment → Build-time Arguments:**
   ```
   CONVEX_DEPLOY_KEY=prod:xxxxxxxx|xxxxxxxxxxxxxxxx
   ```
5. **Domains → Add Domain:** host `vintedut.example.com`, **container port `80`**, HTTPS on, certificate `Let's Encrypt`.
6. Click **Deploy**.

Enable **Autodeploy** (General tab) so every push to `master` redeploys.

---

## Option B — Self-host Convex on Dokploy too

### 1. Deploy the Convex backend
1. In the same project: **Create Service → Template → "Convex"** (or a Compose service using
   the official `docker-compose.yml` from `github.com/get-convex/convex-backend/tree/main/self-hosted/docker`).
2. Add 3 domains to it:
   | Service | Port | Example domain |
   | --- | --- | --- |
   | `backend` | `3210` | `convex-api.example.com` (client/API URL) |
   | `backend` | `3211` | `convex-site.example.com` (HTTP actions — **Convex Auth uses this**) |
   | `dashboard` | `6791` | `convex-dash.example.com` |
3. Set the Compose environment variables so the backend knows its public URLs:
   ```
   CONVEX_CLOUD_ORIGIN=https://convex-api.example.com
   CONVEX_SITE_ORIGIN=https://convex-site.example.com
   NEXT_PUBLIC_DEPLOYMENT_URL=https://convex-api.example.com
   ```
4. Deploy, then generate an admin key (Dokploy → the compose service → **Open Terminal** on `backend`):
   ```bash
   ./generate_admin_key.sh
   ```

### 2. Set Convex Auth secrets on the self-hosted backend
Locally, with a `.env.local` pointing to your self-hosted backend:
```bash
CONVEX_SELF_HOSTED_URL=https://convex-api.example.com
CONVEX_SELF_HOSTED_ADMIN_KEY=<admin key>
```
Then:
```bash
npx @convex-dev/auth
npx convex env set SITE_URL https://vintedut.example.com
```

### 3. Create the frontend app
Same as Option A step 2, but with these **Build-time Arguments** instead:
```
CONVEX_SELF_HOSTED_URL=https://convex-api.example.com
CONVEX_SELF_HOSTED_ADMIN_KEY=<admin key>
```

---

## Checklist / troubleshooting

- **Blank page or "Could not find public function"** → backend functions were not pushed; check the
  build logs for the `convex deploy` step.
- **Sign-in fails** → `JWT_PRIVATE_KEY`, `JWKS` or `SITE_URL` are missing on the target deployment
  (`npx convex env list --prod`). For self-hosted, check `CONVEX_SITE_ORIGIN` is reachable over HTTPS.
- **404 on page refresh** → make sure the domain targets port `80` of the nginx container; `nginx.conf`
  handles the SPA fallback.
- **Build args are visible in image history.** Dokploy builds on your own server, so this is fine
  for a private setup. Don't push this image to a public registry.
