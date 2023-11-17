# Install dependencies only when needed
FROM --platform=$BUILDPLATFORM node:16-alpine AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

RUN npm install -g pnpm@8.1.1

COPY . . 

RUN pnpm install --frozen-lockfile

RUN pnpm run build 

# Production image, copy all the files and run next
FROM node:16-alpine

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app

# You should carefully set this NODE_ENV, set it when use docker-compose or docker-run
# ARG NODE_ENV="production"
# ENV NODE_ENV ${NODE_ENV}

# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

# We need bash to run our entrypoint.sh
RUN apk add --no-cache bash

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Automatically leverage output traces to reduce image size 
# https://nextjs.org/docs/advanced-features/output-file-tracing
# Due to this is a monorepo, nextjs will include all the necessary files from
# packages. So the standalone folder structure will be similar to this
# - apps 
#   - console
# - packages
#   - design-system
#   - toolkit 

COPY --from=builder --chown=nextjs:nodejs /app/apps/console/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/console/.next/static ./apps/console/.next/static

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/apps/console/next.config.js ./apps/console
COPY --from=builder /app/apps/console/package.json ./apps/console/package.json

# We need to grant nextjs user to have the permission to alter the /public folder to
# make next-env.mjs work correctly. (next-env.mjs will create __env.js under public folder)
COPY --from=builder --chown=nextjs:nodejs /app/apps/console/public ./apps/console/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/console/next-env.mjs ./apps/console
COPY --from=builder --chown=nextjs:nodejs /app/apps/console/.env ./apps/console


# Because we need to execute this script, it needs to be copied with this user group
COPY --from=builder --chown=nextjs:nodejs /app/entrypoint.sh ./

USER nextjs

# Permisions to execute script
RUN chmod +x ./entrypoint.sh
RUN chmod +x ./apps/console/next-env.mjs

# We need this permission for next-env.mjs to create the __env.js in /public folder
RUN chmod +wx ./apps/console/public
RUN chmod +rwx ./apps/console/next-env.mjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"