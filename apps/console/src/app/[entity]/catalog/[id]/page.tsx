import { redirect } from "next/navigation";

type RedirectionCatalogPageProps = {
  params: { id: string; entity: string };
};

export default async function RedirectionCatalogPage({
  params,
}: RedirectionCatalogPageProps) {
  const { entity, id } = params;
  return redirect(`/${entity}/catalog/${id}/upload`);
}
