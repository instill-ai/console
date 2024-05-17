import { createInstillAxiosClient } from "../helper";

export type HubStatsResponse = {
  number_of_public_pipelines: number;
  number_of_featured_pipelines: number;
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
