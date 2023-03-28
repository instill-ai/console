# Versatile Data Pipeline (VDP) console

[![Integration Test](https://github.com/instill-ai/console/actions/workflows/integration-test.yml/badge.svg)](https://github.com/instill-ai/console/actions/workflows/integration-test.yml)

## About VDP Console

The VDP console is written in Nextjs, Typescript, TailwindCSS and it runs a docker container with the VDP backend. Interested in trying it out? Check out [here](https://github.com/instill-ai/vdp) to run it locally.

The mission of the console is simple, to provide a unified, clean, and intuitive user experience of VDP, you could set up the full pipeline just by using the browser and investigate every information of your pipelines or connectors on it.

## Repo Structure

The repo mainly follows the guideline of Next.js and has some personal touch on it. Every top-level folder can be pointed to using a module path alias with typescript config enabled. There are some caveats. We will only describe the top-level structure of this repo below `./src` here.

- components: Store all the react components we have
- pages: Next.js pages structure
- contexts: Store all the react context files (We are not using any state management solution right now)
- hooks: Store all the common hooks
- mocks: Store all the mock server workers' file
- services: Most of them are react-query hooks, to provide the interface between the instill-ai’s backends and the console
- styles: We are using TailwindCSS, so this folder only stores the GitHub markdown style and some font-face import CSS file
- types: Store all the typescript types
- utils: utilities about common functions, such as time, javascript primitives and unit-function that don't suit other folders.
- lib: Store all the interfaces that can be used standalone, such as instill-ai backend's query functions, airbyte’s form builder and schema transformer.

### About configuration

- babel.config.js: For the storybook to work correctly. (We use experimental.forceSwcTransforms in next.config.js to force Nextjs use SWC)

## About the UI components

We are following the principles of Instill-ai's design system, you could find the detailed description [here](https://github.com/instill-ai/design-system).

## Code quality tools.

We are using eslint with custom config for code style, commitlint to ensure commit messages follow instill-ai’s rules. Later we will refactor the codebase to adapt full end-to-end tests.

## How to contribute

To set up the local dev environment with this repo, you need to follow the below step:

1. Clone the [VDP repo](https://github.com/instill-ai/vdp)
2. Comment out the console part in the [docker-compose-dev.yml](https://github.com/instill-ai/vdp/blob/f563393dca62fc1961e1a370f5a38fb9bc51c5a3/docker-compose-dev.yml#L510) of the vdp folder. This is because we don’t want the latest image to interrupt our development.
3. In the VDP folder you just clone, use `make build PROFILE=all` to build the full images of vdp, this step will take some time if this is your first time setting up the VDP.
4. In the same VDP folder, use `make dev PROFILE=all` This will bring up the full working VDP backend, except the console you comment out at the second step.
5. Clone the [console repo](https://github.com/instill-ai/console)
6. Install pnpm if you don’t have it, use `npm install -g pnpm` or `brew install pnpm` if you have homebrew.
7. Install all the dependencies, use `pnpm install`.
8. Make sure the environment variables in the `.env` file are correct. They should map one-to-one to the config of the VDP. Please check [.env](/.env) file
9. You can now use `pnpm dev` to run the local Next.js server if your VDP has been set up correctly, it should not have any error at the browser inspection window.
10. If you want to build a docker container you could use `pnpm docker-compose-up`.

## Available scripts

- `pnpm dev`: Set up the dev server for the Nextjs app.
- `pnpm build`: Build a standalone server of Nextjs app.
- `pnpm server`: Start a standalone server of the Next.js app you just built.
- `pnpm docker-compose-up`: Build the docker image of the Next.js app.
- `pnpm docker:prune-cache`: Prune all the cache you have (Be careful of this).
- `pnpm lint`: Lint the codebase.
- `pnpm storybook`: Bring up the storybook server.
- `pnpm docker-build`: Build the docker image of the console
- `pnpm docker-run`: Run the docker image of the console (You could dynamically change the environment variables here)

## About how we set up environment variables

### TLDR

- We introduce `./next-env.mjs` which digests the inline env variables and `.env` file then generate a `__env.js` file.
- It will digest the environment variables from the `.env` file and the `process.env` object. (You can specify that only the variable with prefix `NEXT_PUBLIC_` in the `process.env` will be digested, but it will digest all the variables in the `.env` file.)
- We digest the `__env.js` file into HTML, it will inject additional variables into the window object.
- We use a helper function in `/src/utils/config.ts` to access the window object and get the variables.
- We can still use `process.env` to access the variables in the server-side code.

### In details

In order to empower users to dynamically set up environment variables (They can take down all VDP services, change the console environment variables in the docker-compose then make dev again to update the environment variable in the container.) We need Next.js runtime environment variables instead of normal variables that passed with process.env.

We introduce the shell script `./next-env.mjs`. This script will read through the ./.env file and override it if you pass the new environment variable through docker-compose or `docker run -e` (Just as how we did it in `pnpm docker-run` command.)

This script will then generate a `__env.js` under `/public` folder. Then we include this script into our HTML in the `/src/pages/_document.tsx` file. 

After embedding this script into the root, this `__env.js` will inject the environment variables into the window object so we can access it in the client-side code. We have a helper function lying in the `/src/utils/config.ts` that can help us simplify the process of retrieving the variables.

For server-side code, we will alter the ./.env file in the image. It can also access the newly assigned variables by simply using `process.env`

### How to use

- When in development, please change the variables in the .env file.
- When in production, please change the `docker run -e` argument or change the environment config in the docker-compose file.

### Caveats

- Be careful of env prefix. For example, if you have inlined env CONSOLE_BASE_URL, but in the env file it is written as NEXT_PUBLIC_CONSOLE_BASE_URL, the `env.sh` will not find this env in `.env` file and alter it. We recommend you add `NEXT_PUBLIC_` prefix in all the env related to Next.js

## Security

- We currently use self-signed certification in all our backends so the default of env variable `NEXT_PUBLIC_INTEGRATION_TEST_ENABLED` will be true. This means that the Axios won't complain about `Unauthorized` requests. Please do not set this env variable to true on production. 

## About how to test the console

Please refer to the console integration test [document](/integration-test/README.md)

## Other Caveats

- If you want to set up new path aliases using typescript, remember to add them in the `.storybook/main.js` to make sure storybook will correctly access the file.

###  net::ERR_CERT_AUTHORITY_INVALID

During the local development, our whole backends use self-signed certification. The browser will complain about with `net::ERR_CERT_AUTHORITY_INVALID` error. Please proceed to the API-gateway URL (default: https://localhost:8080) and tell your browser that you want to proceed with the request under this url.

### CI/CD

- **pull_request** to the `main` branch will trigger the **`Integration Test`** workflow running the integration test using the image built on the PR head branch.
- **push** to the `main` branch will trigger
  - the **`Integration Test`** workflow building and pushing the `:latest` image on the `main` branch, following by running the integration test, and
  - the **`Release Please`** workflow, which will create and update a PR with respect to the up-to-date `main` branch using [release-please-action](https://github.com/google-github-actions/release-please-action).

Once the release PR is merged to the `main` branch, the [release-please-action](https://github.com/google-github-actions/release-please-action) will tag and release a version correspondingly.

The images are pushed to Docker Hub [repository](https://hub.docker.com/r/instill/console).
