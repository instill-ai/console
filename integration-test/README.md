
## Future improvemnet

- Use page object model

## About the test container

We maintain another container `Dockerfile.playwright` specifically for test usage. This container has some caveats that maintainers of this repo should notice

- The playwright version should align with the pulled playwright image version. Two should be the same.
- If you want to debug in the test container, you should grant this container the root user permission. (default is specific user: playwright) with `--build-arg TEST_USER='root'` in you `docker build` command

### How to test at local

- In VDP folder: `git pull --rebase` to pull the up-to-date code.
- In VDP folder: `make build PROFILE=all` 
- In console folder: `pnpm dev` to setup local dev server
- If you want to test in your host (Run the app with pnpm dev in the console folder) 
  - In VDP folder: `make dev PROFILE=console ITMODE=true`
  - In console folder: `pnpm dev`
  - In console folder: `pnpm integration-test`
- If you want to test in the docker-container (Run the app with VDP) 
  - In VDP folder: `make dev PROFILE=all ITMODE=true CONSOLE_BASE_URL_HOST=console CONSOLE_BASE_API_GATEWAY_URL_HOST=api-gateway`
  - In console folder: `pnpm docker-build-test`
  - In console folder: `pnpm docker-run-test`

### How to debug the test in the docker

- when build the text container, please alter `pnpm docker-build-test` to `docker build -f Dockerfile.playwright --build-arg TEST_USER='root' -t instill-console-integration .`
- Then the user of this container will have the permission to write test-result into container.
- you could look up the container's id by `docker cp` then copy the test-results into host folder by `docker cp <container_id>:/app/test-results .`

### About the manual test 

Currently we have several steps that require manually testing.

#### Model

- Please follow the step above to setup the VDP backend
- Please create all the model list [here](https://github.com/instill-ai/vdp#model-hub)
- In the `/models` page, please make sure all the created models are correctly listed
- Please click every listed model to go to the model details page `/models/:model_id`
- Please check the model state on the `/models/:model_id` page, you should select the model_instance_tag in the dropdown to the one you just deployed. The model state should be `Online`
- Please switch the state toggle button, the model_state should be `Unspecified` and after a while it should be Offline. Please do it again to check whether it can switch back to the Online state.
- Please delete all the models and make sure they are not displayed on `/models` page

#### Pipeline

- Please use the model you just created to create a sync pipeline.
- Go to the `pipelines/:pipeline_id` page you just created.
- If you switch the state toggle button, it should warn you `Pipeline pipeline-hehe is in the SYNC mode, which is always active`
- Please create a async pipeline with local json destination
- Please go to `pipeline/:pipeline_id` page to check it has correctly displayed data
- Please delete all the pipelines and make sure they are not displayed on `/pipelines` page

## Caveats

### Use `locator.fill()` instead of `locator.type()`

`locator.type()` may act different among browser and cause troubles, if you don't need to test typing feature, we encourage you to use `locator.fill()`.

### About the usage of `click({force: true})`

- Our SingleSelect have multiple clickable item, including the label and the select itself. Sometimes the label will intercept
  the click event, so we recommend to bypass the [actionaility](https://playwright.dev/docs/actionability) check on these elements.
- related issues
  - [subtree intercepts pointer events, Unable to click](https://github.com/microsoft/playwright/issues/13576)
  - [Chromium: Cannot click, element intercepts pointer events](https://github.com/microsoft/playwright/issues/12821)


### About the config `fullyParallel`

- This config will force every test run in parallel even you specific `test.describe.serial`.
- We recommend you set `fullyParallel: false` and control this behavior with fine-grained control.

### About the flaky test

- If the test behavior is related to backend, remember that backend can only handle a request at a time. So if the test run in sequence and the time between requests is too short, the request will fail.
- We have to limit the test worker to one, because the test suite might run too quick to make backend panic.
- Remember to `make down` backend every time you want have another round of test.
- use `expect().to` after every behavior to make sure the behavior succeeded. But you don't need to use `expect(field).toHaveValue()` after you fill in some text, because it had already beem tested by playwright.
- `page.waitForResponse` is not particularly reliable. If you are facing some flaky test, try to rewrite the whole part with some visual hint, like below.

```js

// waitForResponse is flaky

const saveButton = page.locator("button", { hasText: "Save" });
expect(await saveButton.isEnabled()).toBeTruthy();
await Promise.all([saveButton.click(), page.waitForResponse("your url"));

// Rewrite with visual hint

const saveButton = page.locator("button", { hasText: "Save" });
expect(await saveButton.isEnabled()).toBeTruthy();
const succeedMessage = page.locator("h3", { hasText: "Succeed" });
await Promise.all([saveButton.click(), succeedMessage.isVisible()]);
```

