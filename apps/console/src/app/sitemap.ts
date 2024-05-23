import { Organization, Pipeline, User } from "@instill-ai/toolkit";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemaps: MetadataRoute.Sitemap = [];
  const defaultApiUrl = "https://api.instill.tech";
  const defaultBaseUrl = "https://instill.tech";

  const pipelinesUrl = `${
    process.env.NEXT_PUBLIC_API_GATEWAY_URL || defaultApiUrl
  }/vdp/v1beta/pipelines?page_size=100`;
  let nextToken = "";
  const allPipelines: Pipeline[] = [];

  let continueFetching = true;
  while (continueFetching) {
    try {
      const pipelineResponse = await fetch(
        nextToken ? `${pipelinesUrl}&page_token=${nextToken}` : pipelinesUrl
      );

      if (pipelineResponse.ok) {
        const { pipelines, next_page_token } = await pipelineResponse.json();
        allPipelines.push(...pipelines);

        if (!next_page_token) {
          continueFetching = false;
        } else {
          nextToken = next_page_token;
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
        pipeline.owner_name.split("/")[1]
      }/pipelines/${pipeline.id}`,
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

  const organizationsUrl = `${
    process.env.NEXT_PUBLIC_API_GATEWAY_URL || defaultApiUrl
  }/core/v1beta/organizations`;

  try {
    const organizationsResponse = await fetch(organizationsUrl);

    if (organizationsResponse.ok) {
      const { organizations } = await organizationsResponse.json();

      organizations.map((organization: Organization) => {
        sitemaps.push({
          url: `${process.env.NEXT_PUBLIC_CONSOLE_BASE_URL || defaultBaseUrl}/${
            organization?.id
          }`,
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
