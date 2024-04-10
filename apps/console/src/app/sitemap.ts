import { Organization, Pipeline, User } from "@instill-ai/toolkit";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemaps: MetadataRoute.Sitemap = [];

  const pipelinesUrl = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/vdp/v1beta/pipelines?view=VIEW_FULL&page_size=10&visibility=VISIBILITY_PUBLIC`;
  let nextToken = "";
  const allPipelines: Pipeline[] = [];

  let continueFetching = true;
  while (continueFetching) {
    const pipelineResponse = await fetch(
      nextToken ? `${pipelinesUrl}&page_token=${nextToken}` : pipelinesUrl
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
      url: `${process.env.NEXT_PUBLIC_CONSOLE_BASE_URL}/${
        pipeline.owner_name.split("/")[1]
      }/pipelines/${pipeline.id}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    });
  });

  const usersUrl = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/core/v1beta/users`;

  const userResponse = await fetch(usersUrl);
  if (!userResponse.ok) {
    throw new Error("Network response was not ok.");
  }
  const { users } = await userResponse.json();

  users.map((user: User) => {
    sitemaps.push({
      url: `${process.env.NEXT_PUBLIC_CONSOLE_BASE_URL}/${user?.id}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    });
  });

  const organizationsUrl = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/core/v1beta/organizations`;

  const organizationResponse = await fetch(organizationsUrl);
  if (!organizationResponse.ok) {
    throw new Error("Network response was not ok.");
  }
  const { organizations } = await organizationResponse.json();

  organizations.map((organization: Organization) => {
    sitemaps.push({
      url: `${process.env.NEXT_PUBLIC_CONSOLE_BASE_URL}/${organization?.id}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    });
  });

  return sitemaps;
}
