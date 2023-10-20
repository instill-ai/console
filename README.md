# Versatile Data Pipeline (VDP) console

[![Integration Test](https://github.com/instill-ai/console/actions/workflows/integration-test.yml/badge.svg)](https://github.com/instill-ai/console/actions/workflows/integration-test.yml)

## VDP Console

The VDP console is written in Nextjs, Typescript, TailwindCSS and it runs a docker container with the VDP backend. Interested in trying it out? Check out [here](https://github.com/instill-ai/vdp) to run it locally.

The mission of the console is simple, to provide a unified, clean, and intuitive user experience of VDP, you could set up the full pipeline just by using the browser and investigate every information of your pipelines or connectors on it.

## Folder structure

- apps: Store all the instill-ai apps
  - console: The Instill AI console APP
- packages: Store all the packages that will be used across instill-ai frontend projects
  - design-system: The base component of all the instill-ai frontend projects
  - design-token: The design-token that unify the style
  - toolkit: All the high level component of instill-ai frontend projects

Normally, you won't touch the components of design-system due to the casualty will be big. Most of our development is centering around the toolkit. And the console only consume the components from toolkit without having its own components.

## Code Style and Best practices

Please refer to the [Instill AI Frontend Engineer Handbook](https://instill-ai.notion.site/Frontend-Engineer-Handbook-a1b46a06629c4cc5908812844bdd523c?pvs=4)

## Contributing

Please refer to the [Contributing Guidelines](./.github/CONTRIBUTING.md) for more details.

## Available scripts

- `pnpm dev`: Set up the dev server for the Nextjs app.
- `pnpm build`: Build a standalone server of Nextjs app.
- `pnpm docker:prune-cache`: Prune all the cache you have (Be careful of this).
- `pnpm lint`: Lint the codebase.

Because we store the script within a shell script file, you need to grant permission like `sudo chmod 755 './scripts/docker-build.sh'` at the root.

- `pnpm docker-build`: Build the docker image of the console
- `pnpm docker-run`: Run the docker image of the console (You could dynamically change the environment variables here)
- `pnpm docker-build-test`: Build the docker image of the Playright for testing
- `pnpm docker-run-test`: Run the docker image of the Playright for testing

## How we set up the environment variables

Please refer to the [Environment variables document](/docs/environment-variables.md) for more details.

## How to test the console

Please refer to the [Integration test document](/docs/integration-test.md) for more details.

## CI/CD

- **pull_request** to the `main` branch will trigger the **`Integration Test`** workflow running the integration test using the image built on the PR head branch.
- **push** to the `main` branch will trigger
  - the **`Integration Test`** workflow building and pushing the `:latest` image on the `main` branch, following by running the integration test, and
  - the **`Release Please`** workflow, which will create and update a PR with respect to the up-to-date `main` branch using [release-please-action](https://github.com/google-github-actions/release-please-action).
- **release** Once the release PR is merged to the `main` branch, the [release-please-action](https://github.com/google-github-actions/release-please-action) will tag and release a version correspondingly.

The images are pushed to Docker Hub [repository](https://hub.docker.com/r/instill/console).

## License

See the [LICENSE](./LICENSE) file for licensing information.
