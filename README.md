# console

[![Integration Test](https://github.com/instill-ai/console/actions/workflows/integration-test.yml/badge.svg)](https://github.com/instill-ai/console/actions/workflows/integration-test.yml)

## The console of 🔮 Instill Core

The console, developed using Nextjs, Typescript, and TailwindCSS, operates in a docker container alongside other **🔮 Instill Core** components. Want to give it a try? Visit the [instill-core](https://github.com/instill-ai/instill-core) repository to run the suite on your local machine.

The primary objective of the console is to offer a unified, streamlined, and user-friendly interface for **🔮 Instill Core**. It allows users to create, manage, and observe pipelines, models, and artifacts directly from their browser.

## Folder structure

- apps: Store all the instill-ai apps
  - console: The Instill AI console APP
- packages: Store all the packages that will be used across instill-ai frontend projects
  - design-system: The base component of all the instill-ai frontend projects
  - design-token: The design-token that unify the style
  - toolkit: All the high level component of instill-ai frontend projects

Normally, we won't touch the components of design-system due to the casualty will be big. Most of our development is centering around the toolkit. And the console only consume the components from toolkit without having its own components.

## Code Style and Best practices

Please refer to the [Instill AI Frontend Engineer Handbook](https://instill-ai.notion.site/Frontend-Engineer-Handbook-a1b46a06629c4cc5908812844bdd523c?pvs=4)

## Contributing

Please refer to the [Contributing Guidelines](./.github/CONTRIBUTING.md) for more details.

## Available scripts

Please refer to the [Scripts document](/docs/scripts.md) for more details.

## How we set up the environment variables

Please refer to the [Environment variables document](/docs/environment-variables.md) for more details.

## How to test the console

Please refer to the [Integration test document](/docs/integration-test.md) for more details.

## CI/CD

Please refer to the [CI/CD document](/docs/cicd.md) for more details.

## How to add templates into instill-ai

Please refer to the [Template document](/docs/template.md) for more details.

## License

See the [LICENSE](./LICENSE) file for licensing information.

## About the exported CSS variables

- `--pipeline-builder-node-available-width`: control the max width of the node
- `--pipeline-builder-node-padding-x`
- `--pipeline-builder-node-padding-y`
