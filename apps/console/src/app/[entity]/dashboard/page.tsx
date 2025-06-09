import { redirect } from "next/navigation";

type RedirectionDashboardPageProps = {
  params: Promise<{ id: string; entity: string }>;
};

const RedirectionDashboardPage = async (props: RedirectionDashboardPageProps) => {
  const params = await props.params;
  const { entity } = params;

  return redirect(`/${entity}/dashboard/activity`);
};

export default RedirectionDashboardPage;
