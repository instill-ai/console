import type { InstillAPIClient } from "./index";

export class APIResource {
  protected _client: InstillAPIClient;
  protected strict: boolean | undefined;

  constructor(client: InstillAPIClient) {
    this._client = client;
    this.strict = client.strict;
  }
}
