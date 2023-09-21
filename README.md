# Versatile Data Pipeline (VDP) console

[![Integration Test](https://github.com/instill-ai/console/actions/workflows/integration-test.yml/badge.svg)](https://github.com/instill-ai/console/actions/workflows/integration-test.yml)

## About VDP Console

The VDP console is written in Nextjs, Typescript, TailwindCSS and it runs a docker container with the VDP backend. Interested in trying it out? Check out [here](https://github.com/instill-ai/vdp) to run it locally.

The mission of the console is simple, to provide a unified, clean, and intuitive user experience of VDP, you could set up the full pipeline just by using the browser and investigate every information of your pipelines or connectors on it.

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

## About how we set up the environment variables

Please refer to the [Environment variables document](/docs/environment-variables.md) for more details.

## About how to test the console

Please refer to the [Integration test document](/docs/integration-test.md) for more details.

### CI/CD

- **pull_request** to the `main` branch will trigger the **`Integration Test`** workflow running the integration test using the image built on the PR head branch.
- **push** to the `main` branch will trigger
  - the **`Integration Test`** workflow building and pushing the `:latest` image on the `main` branch, following by running the integration test, and
  - the **`Release Please`** workflow, which will create and update a PR with respect to the up-to-date `main` branch using [release-please-action](https://github.com/google-github-actions/release-please-action).

Once the release PR is merged to the `main` branch, the [release-please-action](https://github.com/google-github-actions/release-please-action) will tag and release a version correspondingly.

The images are pushed to Docker Hub [repository](https://hub.docker.com/r/instill/console).

## License

See the [LICENSE](./LICENSE) file for licensing information.
