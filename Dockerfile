FROM node:24-slim AS builder

RUN corepack enable && corepack prepare pnpm@10 --activate

WORKDIR /app

# Copy workspace manifests for better layer caching
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY scripts/package.json ./scripts/
COPY artifacts/api-server/package.json ./artifacts/api-server/
COPY artifacts/tiem-chu-du/package.json ./artifacts/tiem-chu-du/
COPY lib/api-spec/package.json ./lib/api-spec/
COPY lib/api-client-react/package.json ./lib/api-client-react/
COPY lib/api-zod/package.json ./lib/api-zod/
COPY lib/db/package.json ./lib/db/

# Install all dependencies — skip frozen-lockfile since platform overrides differ
# pnpm-workspace.yaml onlyBuiltDependencies allows esbuild/swc to run their postinstall scripts
RUN pnpm install --no-frozen-lockfile

# Copy all source
COPY . .

# Build frontend (Vite), then API server (esbuild bundles everything)
RUN NODE_ENV=production BASE_PATH=/ pnpm --filter @workspace/tiem-chu-du run build
RUN pnpm --filter @workspace/api-server run build

# ---- Runtime: just node + the self-contained bundles ----
FROM node:24-slim AS runtime

WORKDIR /app

# esbuild bundles all dependencies into dist/*.mjs, no node_modules needed at runtime
COPY --from=builder /app/artifacts/api-server/dist ./artifacts/api-server/dist
COPY --from=builder /app/artifacts/tiem-chu-du/dist ./artifacts/tiem-chu-du/dist

ENV NODE_ENV=production

EXPOSE 8080

CMD ["node", "--enable-source-maps", "artifacts/api-server/dist/index.mjs"]
