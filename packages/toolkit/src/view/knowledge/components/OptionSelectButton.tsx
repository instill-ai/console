import { Icons } from "@instill-ai/design-system";

export const SortOptionSelectButton = ({
  onClick,
  label,
  icon,
  isSelected,
}: {
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
  isSelected: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-row items-center px-4 py-[9px] hover:bg-semantic-bg-base-bg"
    >
      <div className="flex flex-row items-center gap-x-2">
        {icon}
        <span
          className={`product-body-text-3-medium ${isSelected ? "text-semantic-fg-primary" : "text-semantic-fg-disabled"
            }`}
        >
          {label}
        </span>
      </div>
      {isSelected ? (
        <Icons.Check className="ml-auto h-4 w-4 stroke-semantic-fg-disabled" />
      ) : null}
    </button>

  );
};
