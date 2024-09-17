import { redirect } from "next/navigation";

type RedirectionPipelinePageProps = {
  params: { id: string; entity: string };
};

export default async function RedirectionPipelinePage({
  params,
}: RedirectionPipelinePageProps) {
  const { entity, id } = params;
  return redirect(`/${entity}/pipelines/${id}/playground`);
}
