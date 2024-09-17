import { redirect } from "next/navigation";

type RedirectionModelPageProps = {
  params: { id: string; entity: string };
};

export default async function RedirectionModelPage({
  params,
}: RedirectionModelPageProps) {
  const { entity, id } = params;
  return redirect(`/${entity}/models/${id}/playground`);
}
