import { APIResource } from "../core/resource";
import { HubStatsResponse } from "./types";

export class HubClient extends APIResource {
  async getHubStats() {
    try {
      const data = await this._client.get<HubStatsResponse>("/hub/stats");
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
