import { Icons, Logos } from "@instill-ai/design-system";
import { PipelineCollapsible } from "./PipelineCollapsible";
import { SidebarLink } from "./SidebarLink";
import { useRouter } from "next/router";

export const Sidebar = () => {
  const router = useRouter();
  return (
    <div className="flex w-[312px] flex-col bg-semantic-bg-primary">
      <div className="mb-auto px-4 pt-8">
        <Logos.VDPExpand className="mb-1 w-[75px]" />
        <PipelineCollapsible className="mb-4" />
        <Logos.MDLExpand className="mb-4 w-[75px]" />
        <SidebarLink
          href="/model-hub"
          icon={<Icons.Cube01 className="h-6 w-6 stroke-semantic-fg-primary" />}
          name="Model Hub"
          hightlighted={router.pathname.split("/")[1] === "model-hub"}
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
      </div>
    </div>
  );
};
