import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { Nullable } from '@instill-ai/toolkit';
import { fetchNamespaceType, fetchUserModel } from '@instill-ai/toolkit/server';

type RedirectionModelPageProps = {
  params: { id: string; entity: string };
};

async function getModelData(entity: string, id: string, accessToken: Nullable<string>) {
  try {
    const namespaceType = await fetchNamespaceType({
      namespace: entity,
      accessToken,
    });
    if (namespaceType === "NAMESPACE_USER" || namespaceType === "NAMESPACE_ORGANIZATION") {
      const namespaceName = `${namespaceType === "NAMESPACE_USER" ? "users" : "organizations"}/${entity}`;
      const modelData = await fetchUserModel({
        modelName: `${namespaceName}/models/${id}`,
        accessToken,
      });
      if (modelData) {
        return modelData;
      }
    }
    return Promise.reject(null);
  } catch (error) {
    console.error(error);
    return Promise.reject(null);
  }
}

export default async function RedirectionModelPage({ params }: RedirectionModelPageProps) {
  const { entity, id } = params;

  const cookieStore = cookies();
  const authSessionCookie = cookieStore.get("instill-auth-session")?.value;
  let accessToken: Nullable<string> = null;
  if (authSessionCookie) {
    accessToken = JSON.parse(authSessionCookie).accessToken;
  }

  try {
    await getModelData(entity, id, accessToken);
    // If the model exists, redirect to the playground
    return redirect(`/${entity}/models/${id}/playground`);
  } catch (error) {
    console.error("Error in RedirectionModelPage:", error);
    return redirect('/404'); // Redirect to 404 if the model doesn't exist or on any error
  }
}