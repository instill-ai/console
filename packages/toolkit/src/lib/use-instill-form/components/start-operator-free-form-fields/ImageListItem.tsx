import { Icons } from "@instill-ai/design-system";

export const ImageListItem = ({
  name,
  onDelete,
}: {
  name: string;
  onDelete: () => void;
}) => {
  return (
    <div className="flex w-full flex-row rounded border border-semantic-bg-line px-2 py-1.5">
      <Icons.File05 className="mr-2 h-5 w-5 stroke-semantic-fg-secondary" />
      <p className="w-[180px] truncate text-semantic-fg-primary product-body-text-3-regular">
        {name}
      </p>
      <button
        onClick={() => onDelete()}
        className="ml-auto hover:bg-semantic-bg-secondary"
        type="button"
      >
        <Icons.X className="h-4 w-4 stroke-semantic-fg-secondary" />
      </button>
    </div>
  );
};
