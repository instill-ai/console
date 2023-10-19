#!/bin/bash
node ./apps/console/next-env.mjs
cd ./apps/console
npx playwright test
