import cn from "clsx";

export type TableErrorProps = {
  marginBottom?: string;
};

export const TableError = (props: TableErrorProps) => {
  const { marginBottom } = props;
  return (
    <div
      className={cn(
        "flex min-h-[300px] w-full border border-instillGrey20 bg-white",
        marginBottom
      )}
    >
      <div className="m-auto flex flex-col gap-y-2.5">
        <p className="m-auto text-instillGrey50 text-instill-small">
          Something went wrong... Please try again later.
        </p>
      </div>
    </div>
  );
};
