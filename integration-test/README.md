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
  - NEXT_PUBLIC_MGMT_BACKEND_BASE_URL=http://localhost:8080
  - NEXT_PUBLIC_PIPELINE_BACKEND_BASE_URL=http://localhost:8081
  - NEXT_PUBLIC_CONNECTOR_BACKEND_BASE_URL=http://localhost:8082
  - NEXT_PUBLIC_MODEL_BACKEND_BASE_URL=http://localhost:8083
  - NEXT_PUBLIC_API_VERSION=v1alpha
  - NEXT_PUBLIC_INSTILL_AI_USER_COOKIE_NAME=instill-ai-user

## About the config `fullyParallel`

- This config will force every test run in parallel even you specific `test.describe.serial`.
- We recommend you set `fullyParallel: false` and control this behavior with fine-grained control.

## About the flaky test

- If the test behavior is related to backend, remember that backend can only handle a request at a time. So if the test run in sequence and the time between requests is too short, the request will fail.
- We have to limit the test worker to one, because the test suite might run to quick to make backend panic.
- Remember to `make down` backend every time you want have another round of test.
- use `expect().to` after every behavior to make sure the behavior succeeded.