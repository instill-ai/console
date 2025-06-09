import { redirect } from "next/navigation";

type RedirectionDashboardCostPageProps = {
  params: Promise<{ id: string; entity: string }>;
};

const RedirectionDashboardCostPage = async (props: RedirectionDashboardCostPageProps) => {
  const params = await props.params;
  const { entity } = params;

  return redirect(`/${entity}/dashboard/cost/pipeline`);
};

export default RedirectionDashboardCostPage;
