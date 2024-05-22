// KnowledgeBaseCard.tsx
import { Icons } from "@instill-ai/design-system";

type KnowledgeBaseCardProps = {
  title: string;
  description: string;
  onClick?: () => void;
};

export const KnowledgeBaseCard = ({
  title,
  description,
  onClick,
}: KnowledgeBaseCardProps) => {
  return (
    <div
      className="flex h-[175px] cursor-pointer flex-col gap-y-2.5 rounded border border-semantic-bg-line bg-[#F8F9FC] p-2.5"
      onClick={onClick}
    >
      <div className="flex items-center gap-x-2">
        <Icons.Plus className="h-4 w-4 stroke-semantic-fg-secondary" />
        <h3 className="text-base font-medium text-black">{title}</h3>
      </div>
      <div className="h-px w-full bg-white" />
      <p className="text-sm text-[rgba(0,0,0,0.7)]">{description}</p>
    </div>
  );
};