import { Icons, Separator } from "@instill-ai/design-system";
import { SidebarLink } from "./SidebarLink";
import { useRouter } from "next/router";

export const Sidebar = () => {
  const router = useRouter();
  return (
    <div className="flex w-[312px] flex-col bg-semantic-bg-primary">
      <div className="mb-auto px-4 pt-8">
        <SidebarLink
          href="/pipelines"
          icon={
            <Icons.Pipeline className="h-6 w-6 stroke-semantic-fg-primary" />
          }
          name="Pipelines"
          hightlighted={router.pathname.split("/")[1] === "pipelines"}
          className="mb-2 px-3"
        />
        <SidebarLink
          href="/resources"
          icon={
            <Icons.IntersectSquare className="h-6 w-6 stroke-semantic-fg-primary" />
          }
          name="Resources"
          hightlighted={router.pathname.split("/")[1] === "resources"}
          className="mb-2 px-3"
        />
        <SidebarLink
          href="/model-hub"
          icon={<Icons.Cube01 className="h-6 w-6 stroke-semantic-fg-primary" />}
          name="Model Hub"
          hightlighted={router.pathname.split("/")[1] === "model-hub"}
          className="mb-2 px-3"
        />
        <Separator orientation="horizontal" className="mb-2" />
        <SidebarLink
          href="/dashboard"
          icon={
            <Icons.BarChartSquare02 className="h-6 w-6 stroke-semantic-fg-primary" />
          }
          name="Dashboard"
          hightlighted={router.pathname.split("/")[1] === "dashboard"}
          className="px-3"
        />
      </div>
      <div className="flex flex-col space-y-6 px-4 pb-8">
        <a
          className="flex flex-row space-x-3 rounded-xs px-3 py-2 hover:bg-semantic-bg-base-bg"
          href="https://www.instill.tech/docs"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icons.HelpCircle className="h-6 w-6 stroke-semantic-fg-primary" />
          <p className="stroke-semantic-fg-primary product-body-text-2-semibold">
            Help
          </p>
        </a>
      </div>
    </div>
  );
};
