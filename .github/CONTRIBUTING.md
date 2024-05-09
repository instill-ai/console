# Contributing Guidelines

We appreciate your contribution to this amazing project! Any form of engagement is welcome, including but not limiting to

- feature request
- documentation wording
- bug report
- roadmap suggestion
- ...and so on!

Please refer to the [community contributing section](https://github.com/instill-ai/community#contributing) for more details.

## Development and codebase contribution

Before delving into the details to come up with your first PR, please familiarise yourself with the project structure of [Instill Core](https://github.com/instill-ai/community#instill-core).

### Sending PRs

Please take these general guidelines into consideration when you are sending a PR:

1. **Fork the Repository:** Begin by forking the repository to your GitHub account.
2. **Create a New Branch:** Create a new branch to house your work. Use a clear and descriptive name, like `<your-github-username>/<what-your-pr-about>`.
3. **Make and Commit Changes:** Implement your changes and commit them. We encourage you to follow these best practices for commits to ensure an efficient review process:
   - Adhere to the [conventional commits guidelines](https://www.conventionalcommits.org/) for meaningful commit messages.
   - Follow the [7 rules of commit messages](https://chris.beams.io/posts/git-commit/) for well-structured and informative commits.
   - Rearrange commits to squash trivial changes together, if possible. Utilize [git rebase](http://gitready.com/advanced/2009/03/20/reorder-commits-with-rebase.html) for this purpose.
4. **Push to Your Branch:** Push your branch to your GitHub repository: `git push origin feat/<your-feature-name>`.
5. **Open a Pull Request:** Initiate a pull request to our repository. Our team will review your changes and collaborate with you on any necessary refinements.

When you are ready to send a PR, we recommend you to first open a `draft` one. This will trigger a bunch of `tests` [workflows](https://github.com/instill-ai/connector-ai/tree/main/.github/workflows) running a thorough test suite on multiple platforms. After the tests are done and passed, you can now mark the PR `open` to notify the codebase owners to review. We appreciate your endeavour to pass the integration test for your PR to make sure the sanity with respect to the entire scope of **Instill Core**.

## How to contribute to the console

### Local development environment setup

- instill-ai/core
  - Go to [instill-ai/core](https://github.com/instill-ai/core) and clone it.
  - Spin up the services by `make latest PROFILE=all`
- instill-ai/vdp
  - Go to [instill-ai/vdp](https://github.com/instill-ai/vdp) and clone it.
  - Spin up the services by `make latest PROFILE=all`
- instill-ai/model (if you are developing model related pages)
  - Go to [instill-ai/model]https://github.com/instill-ai/model) and clone it.
  - Spin up the services by `make latest PROFILE=all`

### Spin up the console

- Go to [instill-ai/console](https://github.com/instill-ai/console) and clone it
- Go to the root of the project and run `pnpm install` and then run `pnpm build`
- Go to the `packages/toolkit` and run `pnpm dev`, keep this terminal running
- Open another terminal then go to the `packages/toolkit` and run `pnpm dev-ts`, keep this terminal running
- Go to the `apps/console`, and run `pnpm dev`, keep this terminal running
- You are all set, go to `http://localhost:3000` to see the console
- The default login password is: `password`

## Last words

Your contributions make a difference. Let's build something amazing together!
