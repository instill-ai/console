import { Icons } from "@instill-ai/design-system";

type KnowledgeBaseCardProps = {
  onClick?: () => void;
  disabled?: boolean;
};

export const KnowledgeBaseCard = ({ onClick, disabled = false }: KnowledgeBaseCardProps) => {
  const cardContent = disabled
    ? "You have reached the maximum limit of 3 knowledge bases that can be created. Please consider deleting any unused knowledge bases if you wish to create a new one."
    : "Import your own text data or write data in real-time via Webhook for LLM context enhancement.";

  return (
    <div
      className={`flex h-[175px] w-[360px] flex-col gap-y-2.5 rounded-md border border-semantic-bg-line p-6 ${disabled
        ? "bg-semantic-bg-secondary cursor-not-allowed"
        : "bg-semantic-bg-base-bg cursor-pointer"
        }`}
      onClick={disabled ? undefined : onClick}
    >
      <div className="flex items-center gap-x-2">
        <Icons.Plus className="h-4 w-4 stroke-semantic-fg-secondary" />
        <h3 className="text-base font-bold text-semantic-fg-primary">
          Create Knowledge
        </h3>
      </div>
      <p className="text-semantic-fg-secondary product-body-text-3-regular">
        {cardContent}
      </p>
    </div>
  );
};