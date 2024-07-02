import { redirect } from "next/navigation";

type Props = {
  params: { entity: string };
};

export default async function Page({ params }: Props) {
  redirect(`/${params.entity}/dashboard/pipeline`);
}
