import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { fetchNamespacePipeline, fetchNamespaceType, fetchUser } from '@instill-ai/toolkit/server';
import { Nullable } from '@instill-ai/toolkit';

type Props = {
  params: { id: string; entity: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

async function getPipelineData(entity: string, id: string, accessToken: Nullable<string>) {
  try {
    const namespaceType = await fetchNamespaceType({
      namespace: entity,
      accessToken,
    });
    if (namespaceType === "NAMESPACE_USER" || namespaceType === "NAMESPACE_ORGANIZATION") {
      const namespaceName = `${namespaceType === "NAMESPACE_USER" ? "users" : "organizations"}/${entity}`;
      return await fetchNamespacePipeline({
        namespacePipelineName: `${namespaceName}/pipelines/${id}`,
        accessToken,
      });
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function isOwner(entity: string, id: string, accessToken: Nullable<string>) {
  if (!accessToken) {
    return false;
  }
  try {
    const currentUser = await fetchUser({
      userName: entity,
      accessToken
    });
    if (!currentUser) {
      return false;
    }
    const pipeline = await fetchNamespacePipeline({
      namespacePipelineName: `users/${entity}/pipelines/${id}`,
      accessToken,
    });
    if (!pipeline) {
      return false;
    }
    return currentUser.id.toString() === pipeline.owner.toString();
  } catch (error) {
    console.error("Error checking ownership:", error);
    return false;
  }
}

export default async function PipelinePage({ params, searchParams }: Props) {
  const { entity, id } = params;
  const tab = searchParams.tab as string | undefined;
  
  const cookieStore = cookies();
  const authSessionCookie = cookieStore.get("instill-auth-session")?.value;
  let accessToken: Nullable<string> = null;
  if (authSessionCookie) {
    accessToken = JSON.parse(authSessionCookie).accessToken;
  }
  
  const pipelineData = await getPipelineData(entity, id, accessToken);
  
  // Redirect to 404 if the pipeline doesn't exist
  if (!pipelineData) {
    return redirect('/404');
  }
  
  const isResourceOwner = await isOwner(entity, id, accessToken);
  
  // Redirect to playground if pipeline exists and no specific tab is requested
  if (!tab) {
    return redirect(`/${entity}/pipelines/${id}/playground`);
  }
  
  // Redirect to playground if not owner and trying to access settings
  if (tab === 'settings' && !isResourceOwner) {
    return redirect(`/${entity}/pipelines/${id}/playground`);
  }
  
  // If we reach here, it means we have a valid tab
  // You can add more specific tab handling here if needed
  return redirect(`/${entity}/pipelines/${id}/${tab}`);
}