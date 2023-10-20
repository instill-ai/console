# Scripts

Besides scripts inside the `package.json`, there are multiple scripts outside of `package.json` in this repo. Most of them are used for the CI/CD workflow. like [scripts folder](/scripts) and [next-env.mjs](/apps/console/next-env.mjs).

## Scripts inside of package.json

- [root](/package.json)
  - `ci-build-packages`: all-in-one scripts, useful on CI/CD
- [apps/console](/apps/console/package.json)
  - `download-airbyte-icons`: use to download Airbyte maintained connector's icons from their GitHub.
  - `check-pnpm-overrides`: check whether there has pnpm overrides configured. Currently, we don't allow this.
- [packages/design-system](/packages/design-system/package.json)
  - `watch:css`: use for local development with TailwindCSS
- [packages/design-token](/packages/design-token/package.json)
  - `build-sd`: build style dictionary tokens
  - `build-tw`: build TailwindCSS preset
  - `build-css-variables`: build CSS variables
- [packages/toolkit](/packages/toolkit/package.json)
  - `dev-ts`: watch file changes to generate typescript types

## Scripts outside of package.json

- `scripts/docker-build`: Build the docker image of the console
- `scripts/docker-run-host`: Run the docker image of the console, the internet is on host machine (Like localhost:3000) (You could dynamically change the environment variables here)
- `scripts/docker-run-docker`: Run the docker image of the console, the internet is on docker (Like console:3000) (You could dynamically change the environment variables here)
- `scripts/docker-build-test`: Build the docker image of the Playright for testing
- `scripts/docker-run-test`: Run the docker image of the Playright for testing
- `scripts/docker-remove.sh`: Remove all the running docker containers
- `apps/console/next-env.mjs`: Please refer to [environment variables document](/docs/environment-variables.md) for more details.

## Caveats

Because we store the script within a shell script file, you need to grant permission like `sudo chmod 755 './scripts/<bash script>'` at the root.

