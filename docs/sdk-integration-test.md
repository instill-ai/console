# SDK integration test

The integration test in the sdk package can help us make sure the contract between frontend and backend stay intact. We want to maintain the maximum test coverage with minimum efforts for it. So we will generate all the msw handlers direct from our openAPI schema and validate it with hand-written zod schema. Our user can also benefit from our zod schema if they demand strong run-time type checking. 

## How does it work

- We first clone our [instill-ai/protobufs](https://github.com/instill-ai/protobufs) into `packages/sdk` folder.
- We then generate the openapi schema using the `make openapi` command in this repo.
- We have a modified version of [zoubingwu/msw-auto-mock](https://github.com/zoubingwu/msw-auto-mock/issues?q=) to generate our own msw handlers.
  - We only want to focus on the 200 status
  - We need to handle the pageToken pagination and many other edge cases
- We set up vitest together with msw to run the integration test.
The verification of data will be handled by our zod validator, which is maintained by the frontend team (This is also the reason why I want to maintain the integration test in the sdk package, I can export these zod validator since there are many other Typescript dev would like to have run-time type safety when interact with our SDK, this can also serve as an additional quality of life)
- We will have istanbul to calculate the coverage of the tests
- 
## What it tests

The test suite only test two things

- Whether the required field is missing in the response
- Whether the basic type is correct (We won't test some complicated type structure included pipeline.recipe, dataSpecification, etc)

It won't test the following things

- The pagination behavior (This is hard to mock and also out of the scope of protobuf. This will rely on backend's own unit-testing in their repo)
- The functionality of data like resource_id and resource_name, create_time and update_time...etc

## Future work

1. Support pageToken pagination: Right now we only support the first page of the response. We need to support the pageToken pagination for our msw handlers