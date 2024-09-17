import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Nullable } from "@instill-ai/toolkit";
import {
  fetchNamespacePipeline,
  fetchNamespaceType,
} from "@instill-ai/toolkit/server";

type RedirectionPipelinePageProps = {
  params: { id: string; entity: string };
};

async function getPipelineData(
  entity: string,
  id: string,
  accessToken: Nullable<string>,
) {
  try {
    const namespaceType = await fetchNamespaceType({
      namespace: entity,
      accessToken,
    });
    if (
      namespaceType === "NAMESPACE_USER" ||
      namespaceType === "NAMESPACE_ORGANIZATION"
    ) {
      const namespaceName = `${namespaceType === "NAMESPACE_USER" ? "users" : "organizations"}/${entity}`;
      return await fetchNamespacePipeline({
        namespacePipelineName: `${namespaceName}/pipelines/${id}`,
        accessToken,
      });
    }
  } catch (error) {
    return null;
  }
  return null;
}

export default async function RedirectionPipelinePage({
  params,
}: RedirectionPipelinePageProps) {
  const { entity, id } = params;
  const cookieStore = cookies();
  const authSessionCookie = cookieStore.get("instill-auth-session")?.value;
  let accessToken: Nullable<string> = null;
  if (authSessionCookie) {
    accessToken = JSON.parse(authSessionCookie).accessToken;
  }

  const pipelineData = await getPipelineData(entity, id, accessToken);
  if (pipelineData) {
    return redirect(`/${entity}/pipelines/${id}/playground`);
  }
  return redirect("/404");
}
