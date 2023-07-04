import cn from "clsx";
import { StatusCard } from "./StatusCard";
import { Status } from "@/types";

export type StatusCardsGroupProps = {
  statusStats: Status[];
  type: "pipeline" | "model";
};

export const StatusCardsGroup = (props: StatusCardsGroupProps) => {
  const { statusStats, type } = props;

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-y-[20px] md:grid-cols-3 md:gap-x-[20px]"
      )}
    >
      {statusStats.map((data) => (
        <StatusCard
          key={`${data.type}-${data.statusname}`}
          type={type}
          statusname={data.statusname}
          amount={data.amount}
        />
      ))}
    </div>
  );
};
