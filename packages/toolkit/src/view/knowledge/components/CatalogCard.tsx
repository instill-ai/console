import { cn, Icons } from "@instill-ai/design-system";

type CatalogCardProps = {
  onClick?: () => void;
  disabled?: boolean;
};

export const CatalogCard = ({
  onClick,
  disabled = false,
}: CatalogCardProps) => {
  const cardContent = disabled
    ? "You reached the limit of Catalogs. Please delete one if you want to create a new one."
    : "Click to create a new, empty catalog for uploading and processing your files.";
  const cardHeader = disabled
    ? "Create Catalog (Limit Reached)"
    : "Create Catalog";

  return (
    <div
      className={cn(
        "flex h-[175px] w-[360px] flex-col gap-y-5 rounded-md border border-semantic-bg-line p-6 bg-semantic-bg-base-bg",
        {
          "cursor-not-allowed": disabled,
          "cursor-pointer": !disabled,
        },
      )}
      onClick={disabled ? undefined : onClick}
    >
      <div className="flex items-center gap-x-2">
        <Icons.Plus
          className={`h-4 w-4 ${disabled
              ? "stroke-semantic-fg-disabled"
              : "stroke-semantic-fg-secondary"
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
