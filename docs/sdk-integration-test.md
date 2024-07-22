# SDK integration test

The integration test in the sdk package can help us make sure the contract between frontend and backend stay intact. We want to maintain the maximum test coverage with minimum efforts for it. So we will generate all the msw handlers direct from our openAPI schema and validate it with hand-written zod schema. Our user can also benefit from our zod schema if they demand strong run-time type checking. 

## How does it work

1. We first clone our [instill-ai/protobufs](https://github.com/instill-ai/protobufs) into `packages/sdk` folder.
2. We then generate the openapi schema using the `make openapi` command in this repo.
3. We have a modified version of [zoubingwu/msw-auto-mock](https://github.com/zoubingwu/msw-auto-mock/issues?q=) to generate our own msw handlers.
   1. We only want to focus on the 200 status
   2. We need to handle the pageToken pagination and many other edge cases
4. We setup vitest together with msw to run the integration test.

## Future work

1. Support pageToken pagination: Right now we only support the first page of the response. We need to support the pageToken pagination for our msw handlers