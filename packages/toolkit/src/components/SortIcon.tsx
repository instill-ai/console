import { Icons } from "@instill-ai/design-system";

export type SortIconsProps = {
  type: "asc" | "desc" | false;
};

export function SortIcon({ type }: SortIconsProps) {
  if (type === "asc") {
    return <Icons.ArrowDown className="h-4 w-4 stroke-semantic-fg-secondary" />;
  }
  if (type === "desc") {
    return <Icons.ArrowUp className="h-4 w-4 stroke-semantic-fg-secondary" />;
  }
  return (
    <Icons.ChevronSelectorVertical className="h-4 w-4 stroke-semantic-fg-secondary" />
  );
}
