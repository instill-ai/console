import { APIResource } from "../../main/resource";
import { CheckNamespaceTypeRequest, CheckNamespaceTypeResponse } from "./types";

export class UtilsClient extends APIResource {
  async checkNamespaceType({ id }: CheckNamespaceTypeRequest) {
    try {
      const data = await this._client.post<CheckNamespaceTypeResponse>(
        "/check-namespace",
        {
          body: JSON.stringify({ id }),
        },
      );

      return Promise.resolve(data.type);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
