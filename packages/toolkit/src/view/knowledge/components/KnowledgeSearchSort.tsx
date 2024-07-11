import { Icons, Input, Popover, Separator } from '@instill-ai/design-system';
import { SortOptionSelectButton } from './OptionSelectButton';

export type SortAnchor = "updateTime" | "numberOfRuns";
export type SortOrder = "asc" | "desc";

const KnowledgeSearchSort = ({ selectedSortOrder,
    setSelectedSortOrder,
    selectedSortAnchor,
    setSelectedSortAnchor
}: {
    selectedSortOrder: SortOrder;
    setSelectedSortOrder: (value: SortOrder) => void;
    selectedSortAnchor: SortAnchor;
    setSelectedSortAnchor: (value: SortAnchor) => void;
}) => {
    return (
        <div className='flex space-x-4'>
            <Input.Root className='!rounded'>
                <Input.LeftIcon>
                    <Icons.SearchSm className="my-auto h-4 w-4 stroke-semantic-fg-primary" />
                </Input.LeftIcon>
                <Input.Core placeholder="Search..." />
            </Input.Root>
            <Popover.Root>
                <Popover.Trigger asChild>
                    <button className="flex flex-row gap-x-2 rounded border border-semantic-bg-line bg-semantic-bg-primary px-4 py-3 text-semantic-fg-primary product-button-button-1">
                        Sort
                        <Icons.ChevronDown className="my-auto h-4 w-4 stroke-semantic-fg-primary" />
                    </button>
                </Popover.Trigger>
                <Popover.Content align="end" className="flex !w-48 flex-col !px-0 py-1">
                    <SortOptionSelectButton
                        label="Updated Time"
                        icon={
                            <Icons.Update className="h-4 w-4 stroke-semantic-fg-disabled" />
                        }
                        onClick={() => {
                            setSelectedSortAnchor("updateTime");
                        }}
                        isSelected={selectedSortAnchor === "updateTime"}
                    />
                    <SortOptionSelectButton
                        label="Total Runs"
                        icon={
                            <Icons.Rocket01 className="h-4 w-4 stroke-semantic-fg-disabled" />
                        }
                        onClick={() => {
                            setSelectedSortAnchor("numberOfRuns");
                        }}
                        isSelected={selectedSortAnchor === "numberOfRuns"}
                    />
                    <Separator orientation="horizontal" className="my-1" />
                    <SortOptionSelectButton
                        label="Ascending"
                        icon={
                            <Icons.SortLinesUp className="h-4 w-4 stroke-semantic-fg-disabled" />
                        }
                        onClick={() => {
                            setSelectedSortOrder("asc");
                        }}
                        isSelected={selectedSortOrder === "asc"}
                    />
                    <SortOptionSelectButton
                        label="Descending"
                        icon={
                            <Icons.SortLinesDown className="h-4 w-4 stroke-semantic-fg-disabled" />
                        }
                        onClick={() => {
                            setSelectedSortOrder("desc");
                        }}
                        isSelected={selectedSortOrder === "desc"}
                    />
                </Popover.Content>
            </Popover.Root>
        </div>
    )
}

export default KnowledgeSearchSort