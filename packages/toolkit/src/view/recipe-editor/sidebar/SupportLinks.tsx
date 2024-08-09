import { Icons } from "@instill-ai/design-system";

export const SupportLinks = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <a
        href="https://discord.com/invite/sevxWsqpGh"
        className="flex gap-x-2 py-1.5 px-2"
        rel="noopener noreferrer"
        target="_blank"
      >
        <Icons.HelpCircle className="h-3 w-3 stroke-semantic-fg-disabled" />
        <div className="my-auto product-button-button-3">Support</div>
      </a>
      <a
        href="https://www.instill.tech/docs"
        className="flex gap-x-2 py-1.5 px-2"
        rel="noopener noreferrer"
        target="_blank"
      >
        <Icons.File06 className="h-3 w-3 stroke-semantic-fg-disabled" />
        <div className="my-auto product-button-button-3">Documentation</div>
      </a>
    </div>
  );
};
