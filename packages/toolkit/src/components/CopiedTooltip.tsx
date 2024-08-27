import { PointerTooltip } from ".";

export const CopiedTooltip = ({ isOpen, children }: { isOpen: boolean, children: React.ReactElement }) => {
  return (
    <PointerTooltip
      isOpen={isOpen}
      tooltipContent={
        <div className="px-2.5 py-1.5 rounded-sm bg-semantic-fg-primary text-semantic-bg-primary text-xs font-semibold">
          Copied!
        </div>
      }
    >
      {children}
    </PointerTooltip>
  );
}