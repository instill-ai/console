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
        <div className="flex h-[175px] flex-col gap-y-2.5 rounded border border-semantic-bg-line bg-white p-2.5 shadow-lg">
            <div className="flex items-center justify-between">
                <h3 className="text-base font-medium text-semantic-fg-primary">
                    {title}
                </h3>
                <Icons.ChevronRight className="h-4 w-4 stroke-semantic-fg-secondary" />
            </div>
            <div className="h-px w-full bg-semantic-bg-line" />
            <p className="text-sm text-semantic-fg-secondary">{description}</p>
            <div className="mt-auto flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <div
                        key={tag}
                        className="rounded bg-semantic-accent-bg px-2 py-0.5 text-xs font-medium text-semantic-fg-primary"
                    >
                        {tag}
                    </div>
                ))}
            </div>
        </div>
    );
};