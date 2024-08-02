import { Icons, Input, Popover, Separator } from "@instill-ai/design-system";
import { SortOptionSelectButton } from "./OptionSelectButton";

export type SortAnchor = "modifyTime" | "createTime" | "usage";
export type SortOrder = "asc" | "desc";

type KnowledgeSearchSortProps = {
  selectedSortOrder: SortOrder;
  setSelectedSortOrder: (value: SortOrder) => void;
  selectedSortAnchor: SortAnchor;
  setSelectedSortAnchor: (value: SortAnchor) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
};

const KnowledgeSearchSort = ({
  selectedSortOrder,
  setSelectedSortOrder,
  selectedSortAnchor,
  setSelectedSortAnchor,
  searchTerm,
  setSearchTerm,
}: KnowledgeSearchSortProps) => {
  return (
    <div className="flex space-x-4">
      <Input.Root className="!rounded">
        <Input.LeftIcon>
          <Icons.SearchSm className="my-auto h-4 w-4 stroke-semantic-fg-primary" />
        </Input.LeftIcon>
        <Input.Core
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Input.Root>
      <Popover.Root>
        <Popover.Trigger asChild>
          <button className="flex flex-row gap-x-2 rounded border border-semantic-bg-line bg-semantic-bg-primary px-4 py-3 text-semantic-fg-primary product-button-button-1">
            Sort
            <Icons.ChevronDown className="my-auto h-4 w-4 stroke-semantic-fg-primary" />
          </button>
        </Popover.Trigger>
        <Popover.Content align="end" className="flex w-64 flex-col !px-0 py-1">
          <SortOptionSelectButton
            label="Created Time"
            icon={<Icons.ClockPlus className="h-5 w-5 mt-1 stroke-semantic-fg-primary" />}
            onClick={() => {
              setSelectedSortAnchor("createTime");
            }}
            isSelected={selectedSortAnchor === "createTime"}
          />
          <SortOptionSelectButton
            label="Modified Time"
            icon={<Icons.ClockCheck className="h-5 w-5 mt-1 stroke-semantic-fg-primary" />}
            onClick={() => {
              setSelectedSortAnchor("modifyTime");
            }}
            isSelected={selectedSortAnchor === "modifyTime"}
          />
          <SortOptionSelectButton
            label="Usage"
            icon={<Icons.TrendUp className="h-5 w-5 mt-1 stroke-semantic-fg-primary" />}
            onClick={() => {
              setSelectedSortAnchor("usage");
            }}
            isSelected={selectedSortAnchor === "usage"}
          />
          <Separator orientation="horizontal" className="my-1" />
          <SortOptionSelectButton
            label="Ascending"
            icon={<Icons.SortLinesUp className="h-4 w-4 stroke-semantic-fg-primary" />}
            onClick={() => {
              setSelectedSortOrder("asc");
            }}
            isSelected={selectedSortOrder === "asc"}
          />
          <SortOptionSelectButton
            label="Descending"
            icon={<Icons.SortLinesDown className="h-4 w-4 stroke-semantic-fg-primary" />}
            onClick={() => {
              setSelectedSortOrder("desc");
            }}
            isSelected={selectedSortOrder === "desc"}
          />
        </Popover.Content>
      </Popover.Root>
    </div>
  );
};

export default KnowledgeSearchSort;
