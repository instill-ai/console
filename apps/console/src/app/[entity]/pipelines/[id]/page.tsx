import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { fetchNamespacePipeline, fetchNamespaceType } from '@instill-ai/toolkit/server';
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

export default async function RedirectionPipelinePage({ params, searchParams }: Props) {
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
    
  // Redirect to playground if pipeline exists and no specific tab is requested
  if (!tab) {
    return redirect(`/${entity}/pipelines/${id}/playground`);
  }
  
}