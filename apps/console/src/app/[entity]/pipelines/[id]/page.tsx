import { redirect } from "next/navigation";

type RedirectionPipelinePageProps = {
  params: Promise<{ id: string; entity: string }>;
};

export default async function RedirectionPipelinePage(
  props: RedirectionPipelinePageProps,
) {
  const params = await props.params;
  const { entity, id } = params;
  return redirect(`/${entity}/pipelines/${id}/playground`);
}
