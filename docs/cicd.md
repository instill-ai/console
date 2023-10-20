# CICD

## pull_request

**PR** to the `main` branch will trigger the **`Integration Test`** workflow running the integration test using the image built on the PR head branch.

## push

**push** to the `main` branch will trigger

- the **`Integration Test`** workflow building and pushing the `:latest` image on the `main` branch, following by running the integration test, and
- the **`Release Please`** workflow, which will create and update a PR with respect to the up-to-date `main` branch using [release-please-action](https://github.com/google-github-actions/release-please-action).

## release

**release** Once the release PR is merged to the `main` branch, the [release-please-action](https://github.com/google-github-actions/release-please-action) will tag and release a version correspondingly.

The images are pushed to Docker Hub [repository](https://hub.docker.com/r/instill/console).