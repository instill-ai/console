import { Icons, Nullable } from "@instill-ai/design-system";

export type RunTableSortableColHeaderProps = {
  currentSortParamValue?: Nullable<string>;
  paramName: string;
  onSort: (value: string) => void;
  title: string;
};
export type Sort = "asc" | "desc" | undefined;

const getIcon = (type: Sort) => {
  switch (type) {
    case "asc":
      return (
        <Icons.ArrowDown className="h-4 w-4 stroke-semantic-fg-secondary" />
      );
    case "desc":
      return <Icons.ArrowUp className="h-4 w-4 stroke-semantic-fg-secondary" />;
    default:
      return (
        <Icons.ChevronSelectorVertical className="h-4 w-4 stroke-semantic-fg-secondary" />
      );
  }
};

export const RunsTableSortableColHeader = ({
  title,
  currentSortParamValue,
  paramName,
  onSort,
}: RunTableSortableColHeaderProps) => {
  const orderedParams = currentSortParamValue?.split(" ");
  const isOrderedByStartTime = orderedParams?.[0] === paramName;
  const currentOrder = orderedParams?.[1] as Sort;

  return (
    <div
      className="flex flex-row items-center gap-x-1 cursor-pointer"
      onClick={() => {
        onSort(`${paramName} ${currentOrder === "asc" ? "desc" : "asc"}`);
      }}
    >
      {title}
      {getIcon(isOrderedByStartTime ? currentOrder : undefined)}
    </div>
  );
};
