// KnowledgeBaseCard.tsx
import { Icons } from "@instill-ai/design-system";

type KnowledgeBaseCardProps = {
  onClick?: () => void;
};

export const KnowledgeBaseCard = ({
  onClick,
}: KnowledgeBaseCardProps) => {
  return (
    <div
      className="flex h-[175px] cursor-pointer flex-col gap-y-2.5 rounded-md border border-semantic-bg-line bg-semantic-bg-base-bg p-6 w-[360px]"
      onClick={onClick}
    >
      <div className="flex items-center gap-x-2">
        <Icons.Plus className="h-4 w-4 stroke-semantic-fg-secondary" />
        <h3 className=" text-base font-bold text-semantic-fg-primary">Create Knowledge</h3>
      </div>
      <p className="product-body-text-3-regular  text-semantic-fg-secondary">Import your own text data or write data in real-time via Webhook for LLM context enhancement.</p>
    </div>
  );
};