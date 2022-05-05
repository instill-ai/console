import { FC } from "react";
import { Item } from "../Tables";
import cn from "clsx";

export type TableHeadProps = {
  items: Item[];
  bgColor: string;
};

const TableHead: FC<TableHeadProps> = ({ items, bgColor }) => {
  return (
    <thead className={cn("px-[24px] py-[5px]", bgColor)}>
      <tr>
        {items.map((e, index) => {
          if (index === 0) {
            return (
              <th className="py-[5px] pl-[23px]" key={e.key}>
                {e.item}
              </th>
            );
          }

          if (index === items.length - 1) {
            return (
              <th className="py-[5px] pr-[23px]" key={e.key}>
                {e.item}
              </th>
            );
          }

          return (
            <th className="py-[5px]" key={e.key}>
              {e.item}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

export default TableHead;
