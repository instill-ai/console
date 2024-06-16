import { createInstillAxiosClient } from "../helper";

export type HubStatsResponse = {
  numberOfPublicPipelines: number;
  numberOfFeaturedPipelines: number;
};

export async function getHubStatsQuery() {
  try {
    const client = createInstillAxiosClient(null, false);

    const { data } = await client.get<HubStatsResponse>("/hub-stats");

    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
}
