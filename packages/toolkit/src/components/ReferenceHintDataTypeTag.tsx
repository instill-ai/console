import cn from "clsx";

export const ReferenceHintDataTypeTag = ({
  className,
  label,
  isArray,
}: {
  className?: string;
  label: string;
  isArray?: boolean;
}) => {
  return isArray ? (
    <div
      className={cn(
        "flex flex-row gap-x-[3px] rounded bg-[#D1FAED] px-[6px] py-[1.5px]",
        className
      )}
    >
      <p className="my-auto align-middle font-sans text-[9px] font-medium text-semantic-success-default	">
        Array
      </p>
      <div className="flex flex-row items-center rounded bg-semantic-success-bg	px-[6px] py-[1.5px]">
        <p className="my-auto align-middle font-sans text-[9px] font-medium text-semantic-success-default">
          {label}
        </p>
      </div>
    </div>
  ) : (
    <div
      className={cn(
        "flex h-5 flex-row items-center rounded bg-semantic-success-bg px-2 py-1",
        className
      )}
    >
      <p className="font-sans text-[11px] font-medium text-semantic-success-default">
        {label}
      </p>
    </div>
  );
};
