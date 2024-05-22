// CreateKnowledgeBaseCard.tsx
import { Icons, Separator, Tag } from "@instill-ai/design-system";

type CreateKnowledgeBaseCardProps = {
  title: string;
  description: string;
  tags: string[];
};

export const CreateKnowledgeBaseCard = ({
  title,
  description,
  tags,
}: CreateKnowledgeBaseCardProps) => {
  return (
    <div className="flex  cursor-pointer flex-col gap-y-2.5 rounded-md border border-semantic-bg-line bg-semantic-bg-primary p-3 w-[360px]"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium text-black">{title}</h3>
      </div>
      <Separator orientation="horizontal" className="my-4" />
      <p className="product-body-text-3-regular">{description}</p>
      <div className="mt-auto flex flex-wrap gap-1">
        {tags.map((tag) => (
          <Tag key={tag}
            variant={"lightNeutral"}
          >
            {tag}
          </Tag>
        ))}
      </div>
    </div>
  );
};

