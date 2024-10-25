import { APIResource } from "../../main/resource";
import {
  GetAuthenticatedUserSubscriptionResponse,
  GetOrganizationSubscriptionRequest,
  GetOrganizationSubscriptionResponse,
} from "./types";

export class SubscriptionClient extends APIResource {
  async getAuthenticatedUserSubscription() {
    try {
      const data =
        await this._client.get<GetAuthenticatedUserSubscriptionResponse>(
          "/user/subscription",
        );
      return Promise.resolve(data.subscription);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getOrganizationSubscription({
    organizationId,
  }: GetOrganizationSubscriptionRequest) {
    try {
      const data = await this._client.get<GetOrganizationSubscriptionResponse>(
        `/organizations/${organizationId}/subscription`,
      );
      return Promise.resolve(data.subscription);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
