FROM node:20-bookworm AS build

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY packages/shared/package.json packages/shared/
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter @cyberquest/shared build \
  && pnpm --filter @cyberquest/api build \
  && pnpm --filter @cyberquest/api deploy --prod /prod/api \
  && rm -rf /prod/api/src /prod/api/tests

FROM node:20-bookworm-slim AS runtime

RUN apt-get update \
  && apt-get install -y --no-install-recommends gosu passwd \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV API_PORT=4000
ENV DATABASE_PATH=/app/data/cyberquest.db
ENV CONTENT_DIR=/app/content
ENV LABS_DIR=/app/labs
ENV DOCKER_SOCKET=/var/run/docker.sock

WORKDIR /app

COPY --from=build /prod/api ./
COPY --from=build /app/content /app/content
COPY --from=build /app/labs /app/labs
COPY docker/api-entrypoint.sh /usr/local/bin/cq-entrypoint

RUN chmod +x /usr/local/bin/cq-entrypoint \
  && mkdir -p /app/data \
  && chown -R node:node /app

EXPOSE 4000

ENTRYPOINT ["/usr/local/bin/cq-entrypoint"]
CMD ["node", "dist/index.js"]
