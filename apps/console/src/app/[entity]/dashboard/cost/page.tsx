import { redirect } from "next/navigation";

type RedirectionDashboardCostPageProps = {
  params: { id: string; entity: string };
};

const RedirectionDashboardCostPage = ({
  params,
}: RedirectionDashboardCostPageProps) => {
  const { entity } = params;

  return redirect(`/${entity}/dashboard/cost/pipeline`);
};

export default RedirectionDashboardCostPage;
