import cn from "clsx";

export type HorizontalDividerProps = {
  marginBottom: string;
  borderColor: string;
};

export const HorizontalDivider = ({
  marginBottom,
  borderColor,
}: HorizontalDividerProps) => {
  return (
    <div className={cn("flex w-full border-b", marginBottom, borderColor)} />
  );
};
