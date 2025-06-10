import { redirect } from "next/navigation";

type RedirectionModelPageProps = {
  params: Promise<{ id: string; entity: string }>;
};

export default async function RedirectionModelPage(
  props: RedirectionModelPageProps,
) {
  const params = await props.params;
  const { entity, id } = params;
  return redirect(`/${entity}/models/${id}/playground`);
}
