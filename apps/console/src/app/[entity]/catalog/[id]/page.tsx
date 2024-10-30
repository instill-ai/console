import { redirect } from "next/navigation";

type RedirectionCatalogPageProps = {
  params: { tab: string; entity: string };
};

export default async function RedirectionCatalogPage({
  params,
}: RedirectionCatalogPageProps) {
  const { entity, tab } = params;
  return redirect(`/${entity}/catalog/${tab}/upload`);
}
