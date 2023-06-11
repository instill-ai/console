import { Icons } from "@instill-ai/design-system";
import { PipelineCollapsible } from "./PipelineCollapsible";

export const Sidebar = () => {
  return (
    <div className="flex w-[312px] flex-col bg-semantic-bg-primary">
      <div className="mb-auto px-4 pt-8">
        <PipelineCollapsible />
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
