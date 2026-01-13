import type { Pipeline, User } from "instill-sdk";
import { MetadataRoute } from "next";

// NOTE: Organization sitemap entries are EE-only (available in console-ee)
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemaps: MetadataRoute.Sitemap = [];
  const defaultApiUrl = "https://api.instill.tech";
  const defaultBaseUrl = "https://instill.tech";

  const pipelinesUrl = `${
    process.env.NEXT_PUBLIC_API_GATEWAY_URL || defaultApiUrl
  }/vdp/v1beta/pipelines?pageSize=100`;
  let nextToken = "";
  const allPipelines: Pipeline[] = [];

  let continueFetching = true;
  while (continueFetching) {
    try {
      const pipelineResponse = await fetch(
        nextToken ? `${pipelinesUrl}&pageToken=${nextToken}` : pipelinesUrl,
      );

      if (pipelineResponse.ok) {
        const { pipelines, nextPageToken } = await pipelineResponse.json();
        allPipelines.push(...pipelines);

        if (!nextPageToken) {
          continueFetching = false;
        } else {
          nextToken = nextPageToken;
        }
      } else {
        continueFetching = false;
      }
    } catch (error) {
      continueFetching = false;
    }
  }

  allPipelines.map((pipeline: Pipeline) => {
    sitemaps.push({
      url: `${process.env.NEXT_PUBLIC_CONSOLE_BASE_URL || defaultBaseUrl}/${
        pipeline.ownerName.split("/")[1]
      }/pipelines/${pipeline.id}/playground`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    });
  });

  const usersUrl = `${
    process.env.NEXT_PUBLIC_API_GATEWAY_URL || defaultApiUrl
  }/core/v1beta/users`;

  try {
    const usersResponse = await fetch(usersUrl);

    if (usersResponse.ok) {
      const { users } = await usersResponse.json();

      users.map((user: User) => {
        sitemaps.push({
          url: `${process.env.NEXT_PUBLIC_CONSOLE_BASE_URL}/${user?.id}`,
          lastModified: new Date(),
          changeFrequency: "daily",
          priority: 1,
        });
      });
    }
  } catch (error) {
    console.error(error);
  }

  return sitemaps;
}
