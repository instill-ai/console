import { APIResource } from "../../main/resource";
import {
  CheckNameAvailabilityRequest,
  CheckNameAvailabilityResponse,
  CheckNamespaceTypeRequest,
  CheckNamespaceTypeResponse,
} from "./types";

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

  async checkNameAvailability({ name }: CheckNameAvailabilityRequest) {
    try {
      const data = await this._client.post<CheckNameAvailabilityResponse>(
        "/check-name",
        {
          body: JSON.stringify({ name }),
        },
      );

      return Promise.resolve(data.availability);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
