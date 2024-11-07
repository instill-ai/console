import { redirect } from "next/navigation";

type RedirectionDashboardPageProps = {
  params: { id: string; entity: string };
};

const RedirectionDashboardPage = ({
  params,
}: RedirectionDashboardPageProps) => {
  const { entity } = params;

  return redirect(`/${entity}/dashboard/activity`);
};

export default RedirectionDashboardPage;
