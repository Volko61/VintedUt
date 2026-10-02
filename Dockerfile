# ---- Build stage ----
FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@11.1.1 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# Provide ONE of these sets as Dokploy build args:
#   Convex Cloud:       CONVEX_DEPLOY_KEY
#   Self-hosted Convex: CONVEX_SELF_HOSTED_URL + CONVEX_SELF_HOSTED_ADMIN_KEY
# `convex deploy` pushes the backend functions, then runs the Vite build with
# VITE_CONVEX_URL set to the right deployment URL.
ARG CONVEX_DEPLOY_KEY
ARG CONVEX_SELF_HOSTED_URL
ARG CONVEX_SELF_HOSTED_ADMIN_KEY
RUN npx convex deploy --cmd "pnpm run build"

# ---- Runtime stage ----
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
