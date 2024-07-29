import React from "react";
import { Icons } from "@instill-ai/design-system";

type KnowledgeBaseCardProps = {
  onClick?: () => void;
  disabled?: boolean;
};

export const KnowledgeBaseCard: React.FC<KnowledgeBaseCardProps> = ({
  onClick,
  disabled = false,
}) => {
  const cardContent = disabled
    ? "You have reached the maximum limit of 3 knowledge bases that can be created. Please consider deleting any unused knowledge bases if you wish to create a new one."
    : "Import your own text data or write data in real-time via Webhook for LLM context enhancement.";
  const cardHeader = disabled
    ? "Create Knowledge (Limit Reached)"
    : "Create Knowledge";

  return (
    <div
      className={`flex h-[175px] w-[360px] flex-col gap-y-2.5 rounded-md border border-semantic-bg-line p-6 ${disabled
        ? "bg-semantic-bg-base-bg cursor-not-allowed"
        : "bg-semantic-bg-base-bg cursor-pointer"
        }`}
      onClick={disabled ? undefined : onClick}
    >
      <div className="flex items-center gap-x-2">
        <Icons.Plus
          className={`h-4 w-4 ${disabled ? "stroke-semantic-fg-disabled" : "stroke-semantic-fg-secondary"
            }`}
        />
        <div
          className={` product-body-text-2-medium ${disabled ? "text-semantic-fg-disabled" : "text-semantic-fg-primary"
            }`}
        >
          {cardHeader}
        </div>
      </div>
      <p
        className={`product-body-text-3-regular ${disabled ? "text-semantic-fg-disabled" : "text-semantic-fg-secondary"
          }`}
      >
        {cardContent}
      </p>
    </div>
  );
};