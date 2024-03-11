export * from "./connector";
export * from "./metric";
export * from "./mgmt";
export * from "./model";
export * from "./pipeline";
export * from "./organization";

/** Re export react-query to solve ESM, CJS confict issue */
export {
  QueryCache,
  QueryClient,
  QueryClientProvider,
  useQueries,
  useQuery,
  useQueryClient,
  useMutation,
  hydrate,
  dehydrate,
} from "@tanstack/react-query";
export { ReactQueryDevtools } from "@tanstack/react-query-devtools";
export type {
  DehydratedState,
  UseQueryResult,
  UseMutationResult,
  DefaultOptions,
} from "@tanstack/react-query";

// React-Query introduce a breaking change in v5.0.0 about query level error handling
// They remove this API and demand user to handle error on the global cache level.
// We will use this enum to handle error on the global cache level.
// ref: https://stackoverflow.com/questions/76961108/react-query-onsuccess-onerror-onsettled-are-deprecated-what-should-i-use-ins
// ref: https://tkdodo.eu/blog/breaking-react-querys-api-on-purpose

export const enum ReactQueryErrorCode {
  NO_ACCESS_TOKEN,
}
