import { FC } from "react";
import cn from "clsx";

export type HorizontalDividerProps = {
  marginBottom: string;
  borderColor: string;
};

const HorizontalDivider: FC<HorizontalDividerProps> = ({
  marginBottom,
  borderColor,
}) => {
  return (
    <div className={cn("flex w-full border-b", marginBottom, borderColor)} />
  );
};

export default HorizontalDivider;
