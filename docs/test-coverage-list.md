# Test coverage list

This list is to estabilish a semantic meaning toward the unit/e2e test coverage

## Unit test

- [x] **pipeline-builder:** generate edges from given components [test](../packages/toolkit/src/view/pipeline-builder/lib/composeEdgesFromComponents.test.ts)

## E2E test

- [x] Create Pipeline
- [x] Delete Pipeline
- [x] Delete Connector
- [x] **pipeline-builder:** should correctly change component's ID [test](../apps/console/integration-test/tests/should-change-component-id.test.ts)
- [x] **pipeline-builder:** should correctly unmarshal input when trigger the pipeline [test](../apps/console/integration-test/tests/should-unmarshal.test.ts)
- [x] **pipeline-builder:** should correctly create/edit fields in start and end operator [test](../apps/console/integration-test/tests/should-edit-create-start-end-field.test.ts)
  - missing: delete fields in start and end operator
