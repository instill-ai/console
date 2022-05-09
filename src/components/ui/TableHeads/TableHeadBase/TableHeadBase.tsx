import { FC, ReactNode } from "react";
import cn from "clsx";

export type Item = {
  key: string;
  item: string | ReactNode;
};

export type TableHeadBaseProps = {
  items: Item[];
  bgColor: string;
  borderColor: string;
};

const TableHeadBase: FC<TableHeadBaseProps> = ({
  items,
  bgColor,
  borderColor,
}) => {
  return (
    <thead className={cn("border", borderColor, bgColor)}>
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

export default TableHeadBase;
