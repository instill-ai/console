// CreatedKnowledgeBaseCard.tsx
import { Icons } from "@instill-ai/design-system";

type CreatedKnowledgeBaseCardProps = {
  title: string;
  description: string;
  tags: string[];
};

export const CreatedKnowledgeBaseCard = ({
  title,
  description,
  tags,
}: CreatedKnowledgeBaseCardProps) => {
  return (
    <div className="flex h-[175px] flex-col gap-y-2.5 rounded bg-white p-2.5 shadow-[0px_2px_8px_rgba(0,0,0,0.12)]">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium text-black">{title}</h3>
        <Icons.ChevronRight className="h-4 w-4 stroke-[rgba(29,36,51,0.8)]" />
      </div>
      <div className="h-px w-full bg-[#E1E6EF]" />
      <p className="text-sm text-[rgba(0,0,0,0.7)]">{description}</p>
      <div className="mt-auto flex flex-wrap gap-1">
        {tags.map((tag) => (
          <div
            key={tag}
            className="rounded bg-[#F1F3F9] px-2 py-0.5 text-xs font-medium text-[rgba(29,36,51,0.8)]"
          >
            {tag}
          </div>
        ))}
      </div>
    </div>
  );
};