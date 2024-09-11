import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { fetchNamespacePipeline, fetchNamespaceType } from '@instill-ai/toolkit/server';
import { Nullable } from '@instill-ai/toolkit';

type RedirectionPipelinePageProps = {
  params: { id: string; entity: string };
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

export default async function RedirectionPipelinePage({ params }: RedirectionPipelinePageProps) {
  const { entity, id } = params;

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

}