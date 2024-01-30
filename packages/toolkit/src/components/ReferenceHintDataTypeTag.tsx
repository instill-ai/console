import cn from "clsx";

export const ReferenceHintDataTypeTag = ({
  className,
  label,
}: {
  className?: string;
  label: string;
}) => {
  return (
    <div
      className={cn(
        "flex h-5 flex-row items-center gap-x-1 rounded bg-semantic-success-bg px-2 py-1",
        className
      )}
    >
      <p className="font-sans text-[11px] font-medium text-semantic-success-default">
        {label}
      </p>
    </div>
  );
};
