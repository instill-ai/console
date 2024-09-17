import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Nullable } from "@instill-ai/toolkit";
import { fetchNamespaceType, fetchUserModel } from "@instill-ai/toolkit/server";

type RedirectionModelPageProps = {
  params: { id: string; entity: string };
};

async function getModelData(
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
      return await fetchUserModel({
        modelName: `${namespaceName}/models/${id}`,
        accessToken,
      });
    }
  } catch (error) {
    return null;
  }
  return null;
}

export default async function RedirectionModelPage({
  params,
}: RedirectionModelPageProps) {
  const { entity, id } = params;
  const cookieStore = cookies();
  const authSessionCookie = cookieStore.get("instill-auth-session")?.value;
  let accessToken: Nullable<string> = null;
  if (authSessionCookie) {
    accessToken = JSON.parse(authSessionCookie).accessToken;
  }

  const modelData = await getModelData(entity, id, accessToken);
  if (modelData) {
    return redirect(`/${entity}/models/${id}/playground`);
  }
  return redirect("/404");
}
