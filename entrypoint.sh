#!/bin/bash
node ./apps/console/next-env.mjs

# Because we are in the monorepo and the build in happening at the
# root, the nextjs standalone build will include other dependent
# packages and retain its original path. So we need to go into
# the console directory to run the server.
node ./apps/console/server.js
