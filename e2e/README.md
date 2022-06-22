# Caveats

## About the usage of `click({force: true})`

- Our SingleSelect have multiple clickable item, including the label and the select itself. Sometimes the label will intercept
  the click event, so we recommend to bypass the [actionaility](https://playwright.dev/docs/actionability) check on these elements.
- related issues
  - [subtree intercepts pointer events, Unable to click](https://github.com/microsoft/playwright/issues/13576)
  - [Chromium: Cannot click, element intercepts pointer events](https://github.com/microsoft/playwright/issues/12821)

## About the env variables

- We use `.env` and `dotenv` to digest environment variables.
- Make sure your `.env` file have following variables:
  - NEXT_PUBLIC_MAIN_URL=http://localhost:3000
  - NEXT_PUBLIC_MGMT_API_ENDPOINT=http://localhost:8080
  - NEXT_PUBLIC_PIPELINE_API_ENDPOINT=http://localhost:8081
  - NEXT_PUBLIC_CONNECTOR_API_ENDPOINT=http://localhost:8082
  - NEXT_PUBLIC_MODEL_API_ENDPOINT=http://localhost:8083
  - NEXT_PUBLIC_API_VERSION=v1alpha
  - NEXT_PUBLIC_INSTILL_AI_USER_COOKIE_NAME=instill-ai-user
