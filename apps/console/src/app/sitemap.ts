import { Organization, Pipeline, User } from "@instill-ai/toolkit";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemaps: MetadataRoute.Sitemap = [];

  const pipelinesUrl = `https://api.instill.tech/vdp/v1beta/pipelines?view=VIEW_FULL&page_size=10&visibility=VISIBILITY_PUBLIC`;
  let nextToken = "";
  const allPipelines: Pipeline[] = [];

  let continueFetching = true;
  while (continueFetching) {
    const pipelineResponse = await fetch(
      nextToken ? `${pipelinesUrl}&page_token=${nextToken}` : pipelinesUrl,
    );
    if (!pipelineResponse.ok) {
      throw new Error("Network response was not ok.");
    }
    const { pipelines, next_page_token } = await pipelineResponse.json();
    allPipelines.push(...pipelines);

    if (!next_page_token) {
      continueFetching = false;
    } else {
      nextToken = next_page_token;
    }
  }

  allPipelines.map((pipeline: Pipeline) => {
    sitemaps.push({
      url: `https://instill.tech/${
        pipeline.owner_name.split("/")[1]
      }/pipelines/${pipeline.id}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    });
  });

  const usersUrl = `https://api.instill.tech/core/v1beta/users`;

  const userResponse = await fetch(usersUrl);
  if (!userResponse.ok) {
    throw new Error("Network response was not ok.");
  }
  const { users } = await userResponse.json();

  users.map((user: User) => {
    sitemaps.push({
      url: `https://instill.tech/${user?.id}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    });
  });

  const organizationsUrl = `https://api.instill.tech/core/v1beta/organizations`;

  const organizationResponse = await fetch(organizationsUrl);
  if (!organizationResponse.ok) {
    throw new Error("Network response was not ok.");
  }
  const { organizations } = await organizationResponse.json();

  organizations.map((organization: Organization) => {
    sitemaps.push({
      url: `https://instill.tech/${organization?.id}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    });
  });

  return sitemaps;
}
