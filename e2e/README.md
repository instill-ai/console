# Caveats

## About the usage of `click({force: true})`

- Our SingleSelect have multiple clickable item, including the label and the select itself. Sometimes the label will intercept
  the click event, so we recommend to bypass the [actionaility](https://playwright.dev/docs/actionability) check on these elements.
- related issues
  - [subtree intercepts pointer events, Unable to click](https://github.com/microsoft/playwright/issues/13576)
  - [Chromium: Cannot click, element intercepts pointer events](https://github.com/microsoft/playwright/issues/12821)