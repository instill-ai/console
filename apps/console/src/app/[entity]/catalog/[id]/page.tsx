import { redirect } from "next/navigation";

type RedirectionModelPageProps = {
  params: { tab: string; entity: string };
};

export default async function RedirectionCatalogPage({
  params,
}: RedirectionModelPageProps) {
  const { entity, tab } = params;
  return redirect(`/${entity}/catalog/${tab}/upload`);
}
