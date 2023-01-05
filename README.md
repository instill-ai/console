# Versatile Data Pipeline (VDP) console

## About VDP Console

The VDP console is written in Nextjs, Typescript, TailwindCSS and it runs a docker container with the VDP backend. Interested in trying it out? Check out [here](https://github.com/instill-ai/vdp) to run it locally.

The mission of the console is simple, to provide an unified, clean, and intuitive user experience of VDP, you could set up the full pipeline just by using the browser and investigate every information of your pipelines or connectors on it.

## Repo Structure

The repo mainly follows the guideline of Next.js and has some personal touch on it. Every top level folder can be pointed to using module path alias with typescript config enabled. There are some caveats which will be covered later. We will only describe the top level structure of this repo below `./src` here.

- components: Store all the react components we have
- pages: Next.js pages structure
- contexts: Store all the react context file (We are not using any state management solution right now)
- hooks: Store all the common hooks
- mocks: Store all the mock server workers file
- services: Most of them are react-query hooks, to provide the interface between the instill-ai’s backends and the console
- styles: We are using TailwindCSS, so this folder only store the github markdown style and some font-face import css file
- types: Store all the typescript types
- utils: utilities about common functions, such as time, javascript primitives and unit-function that don't suit other folders.
- lib: Store all the interface that can be used standalone, such as instill-ai backend's query functions, airbyte’s form builder and schema transformer.

## About the UI components

We are following the principles of Instill-ai's design system, you could find the detailed description [here](https://github.com/instill-ai/design-system).

## Code quality tools.

We are using eslint with custom config for code style, commitlint to ensure commit messages follow instill-ai’s rules. Later we will refactor the codebase to adapt full end to end tests.

## How to contribute

To setup the local dev environment with this repo, you need follow the below step:

1. Clone the [VDP repo](https://github.com/instill-ai/vdp)
2. Comment out the console part in the [docker-compose-dev.yml](https://github.com/instill-ai/vdp/blob/f563393dca62fc1961e1a370f5a38fb9bc51c5a3/docker-compose-dev.yml#L510) of the vdp folder. This is because we don’t want the latest image to interrupt our development.
3. In the VDP folder you just clone, use `make build PROFILE=all` to build the full images of vdp, this step will take some time if this is your first time setting up the VDP.
4. In the same VDP folder, use `make dev PROFILE=all` This will bring up the full working VDP backend, except the console you comment out at the second step.
5. Clone the [console repo](https://github.com/instill-ai/console)
6. Install pnpm if you don’t have it, use `npm install -g pnpm` or `brew install pnpm` if you have homebrew.
7. Install all the dependencies, use `pnpm install`.
8. Make sure the environment variables in the `.env` file are correct. They should map one-to-one to the config of the VDP. By default they are

```
- NEXT_PUBLIC_CONSOLE_BASE_URL=http://localhost:3000
- NEXT_PUBLIC_MGMT_BACKEND_BASE_URL=http://localhost:8084
- NEXT_PUBLIC_PIPELINE_BACKEND_BASE_URL=http://localhost:8081
- NEXT_PUBLIC_CONNECTOR_BACKEND_BASE_URL=http://localhost:8082
- NEXT_PUBLIC_MODEL_BACKEND_BASE_URL=http://localhost:8083
- NEXT_PUBLIC_API_VERSION=v1alpha
```

9. You can now use `pnpm dev` to run the local Next.js server if your VDP has been set up correctly, it should not have any error at the browser inspection window.
10. If you want to build a docker container you could use `pnpm docker-compose-up`.

## Available scripts

- `pnpm dev`: Set up the dev server for the Next.js app.
- `pnpm build`: Build a standalone server of Next.js app.
- `pnpm server`: Start a standalone server of the Next.js app you just built.
- `pnpm docker-compose-up`: Build the docker image of the Next.js app.
- `pnpm docker:prune-cache`: Prune all the cache you have (Be careful of this).
- `pnpm lint`: Lint the codebase.
- `pnpm storybook`: Bring up the storybook server.
- `pnpm docker-build`: Build the docker image of console
- `pnpm docker-run`: Run the docker image of console (You could dynamically change the environment variables here)

## About how we set up environment variables

### TLDR

- We introduce `./env.sh` that will generate a `__env.js` file.
- We digest the `__env.js` file into HTML, it will inject additional variables into window object.
- We use a helper function in `/src/utils/config.ts` to access window object and get the variables.
- We can still use `process.env` to access the variables in the server-side code.

### In details

In order to empower user to dynamically set up environment variables (They can make down all VDP services, change the console environment variables in the docker-compose then make dev again to update the environment variable in the container.) We need Next.js runtime environment variables instead of normal variables that passed with process.env.

We introduce the shell script `./env.sh`. This script will read through the ./.env file and override it if you pass the new environment variable through docker-compose or `docker run -e` (Just as how we did it in `pnpm docker-run` command.)

This script will then generate a `__env.js` under `/public` folder. Then we include this script into our HTML in the `/src/pages/_document.tsx` file. 

After embedding this script into the root, this `__env.js` will inject the environment variables into the window object so we can access it in the client-side code. We have a helper function lie in the `/src/utils/config.ts` that can help us simplify the process of retrieving the variables.

For server-side code, because we will alter the ./.env file in the image. It can also access the new assigned variables by simply using `process.env`

### How to use

- When in development, please change the variables in the .env file.
- When in production, please change the `docker run -e` argument or change the environment config in the docker-compose file.

## Caveats

If you want to set up new path aliases using typescript, remember to add them in the `.storybook/main.js` to make sure storybook will correctly access the file.
