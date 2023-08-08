import { Icons } from "@instill-ai/design-system";
import { PipelineCollapsible } from "./PipelineCollapsible";
import { SidebarLink } from "./SidebarLink";
import { useRouter } from "next/router";
import Link from "next/link";

export const Sidebar = () => {
  const router = useRouter();
  return (
    <div className="flex w-[312px] flex-col bg-semantic-bg-primary">
      <div className="mb-auto px-4 pt-4">
        <PipelineCollapsible />
        <SidebarLink
          href="/model-hub"
          icon={<Icons.Cube01 className="h-6 w-6 stroke-semantic-fg-primary" />}
          name="Model Hub"
          hightlighted={router.pathname.split("/")[1] === "model-hub"}
          className="mb-3 px-3"
        />
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
          href="https://www.instill.tech/docs/welcome"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icons.HelpCircle className="h-6 w-6 stroke-semantic-fg-primary" />
          <p className="stroke-semantic-fg-primary product-body-text-2-semibold">
            Help
          </p>
        </a>
        <Link
          className="flex flex-row space-x-3 px-3 py-2 hover:bg-semantic-bg-base-bg"
          href="/api/auth/logout"
        >
          <Icons.Logout01 className="h-6 w-6 stroke-semantic-fg-primary" />
          <p className="stroke-semantic-fg-primary product-body-text-2-semibold">
            Logout
          </p>
        </Link>
      </div>
    </div>
  );
};
