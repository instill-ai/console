import { Icons } from "@instill-ai/design-system";

type SortSelectButtonProps = {
    onClick: () => void;
    label: string;
    icon: React.ReactNode;
    isSelected: boolean;
};

const SortSelectButton = ({
    onClick,
    label,
    icon,
    isSelected,
}: SortSelectButtonProps) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center px-4 py-2 hover:bg-semantic-bg-base-bg"
        >
            <div className="flex items-center gap-2">
                {icon}
                <span className="text-semantic-fg-primary product-body-text-3-medium">
                    {label}
                </span>
            </div>
            {isSelected && (
                <Icons.Check className="ml-auto h-4 w-4 stroke-semantic-fg-disabled" />
            )}
        </button>
    );
};

export default SortSelectButton;