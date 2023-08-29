import cn from "clsx";
import { Handle, HandleProps } from "reactflow";

export type CustomHandleProps = HandleProps & {
  className?: string;
};

export const CustomHandle = (props: CustomHandleProps) => {
  const { className, ...passThrough } = props;

  return (
    <div
      className={cn(
        "absolute top-1/2 -translate-y-1/2",
        passThrough.type === "target"
          ? "left-0 -translate-x-full"
          : "right-0 translate-x-full"
      )}
    >
      <Handle
        {...passThrough}
        className={cn(
          "!static !flex !h-4 !w-4 !border-[3px] !border-semantic-accent-pressed !bg-semantic-bg-primary",
          className
        )}
      />
    </div>
  );
};
