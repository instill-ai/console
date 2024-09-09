import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { fetchNamespaceType, fetchUserModel } from '@instill-ai/toolkit/server';
import { Nullable } from '@instill-ai/toolkit';

type Props = {
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
      return await fetchUserModel({
        modelName: `${namespaceName}/models/${id}`,
        accessToken,
      });
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function RedirectionModelPage({ params }: Props) {
  const { entity, id } = params;
  
  const cookieStore = cookies();
  const authSessionCookie = cookieStore.get("instill-auth-session")?.value;
  let accessToken: Nullable<string> = null;
  if (authSessionCookie) {
    accessToken = JSON.parse(authSessionCookie).accessToken;
  }
  
  const modelData = await getModelData(entity, id, accessToken);
  
  // Redirect to 404 if the model doesn't exist
  if (!modelData) {
    return redirect('/404');
  }
  
  // If the model exists, redirect to the playground
  return redirect(`/${entity}/models/${id}/playground`);
}