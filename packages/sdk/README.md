# Overview

Typescript SDK for Instill AI products

> [!IMPORTANT]  
> **This SDK tool is under heavy development!!**  
> Currently there has yet to be a stable version release, please feel free to open any issue regarding this SDK in our [community](https://github.com/instill-ai/community/issues) repo

## Requirements

- Node 18+

## Installation

```
npm i instill-sdk
```

```
yarn add instill-sdk
```

```
pnpm add instill-sdk
```

## Usage

### Import

```typescript
import { InstillAPIClient } from "instill-sdk";

const client = new InstillAPIClient({
  // Note: Model related endpoint is still in v1alpha version
  baseURL: "https://api.instill.tech/v1beta",
  apiKey: "<YOUR_API_KEY>",
});
```

### Useful helper for you to reuse the client instance

```typescript
import { InstillAPIClient } from "instill-sdk";

let instillAPIClient: InstillAPIClient | null = null;

export function getInstillAPIClient() {
  if (!instillAPIClient) {
    const baseURL = `${
      process.env.NEXT_SERVER_API_GATEWAY_URL ??
      env("NEXT_PUBLIC_API_GATEWAY_URL")
    }/${env("NEXT_PUBLIC_GENERAL_API_VERSION")}`;

    instillAPIClient = new InstillAPIClient({
      // Note: Model related endpoint is still in v1alpha version
      baseURL: "https://api.instill.tech/v1beta",
      apiToken: "<YOUR_API_KEY>",
    });
  }

  return instillAPIClient;
}
```

### Example: Get all accessible pipelines

```typescript
export async function getAccessiblePipelines() {
  try {
    const pipelines = await client.vdp.pipeline.listAccessiblePipelines({
      // This means you don't want to get the paginated response, instead,
      // you will get all the pipelines in one go
      enablePagination: false,

      // This means you want to have the full pipeline data object
      view: "VIEW_FULL",
    });

    return Promise.resolve(pipelines);
  } catch (error) {
    return Promise.reject(error);
  }
}
```

### Example: Get all models under your namespace

Let's say your namespace is `users/instill-ai`

```typescript
export async function getNamespaceModels() {
  try {
    const models = await client.model.listNamespaceModels({
      namespaceName: "users/instill-ai",
      enablePagination: false,
      view: "VIEW_FULL",
    });

    return Promise.resolve(models);
  } catch (error) {
    return Promise.reject(error);
  }
}
```
