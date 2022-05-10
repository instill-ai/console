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
          const element =
            typeof e.item === "string" ? (
              <p className="instill-text-body text-instillGrey90 flex">
                {e.item}
              </p>
            ) : (
              e.item
            );

          if (index === 0) {
            return (
              <th className="py-[5px] pl-[23px]" key={e.key}>
                {element}
              </th>
            );
          }

          if (index === items.length - 1) {
            return (
              <th className="py-[5px] pr-[23px]" key={e.key}>
                {element}
              </th>
            );
          }

          return (
            <th className="py-[5px]" key={e.key}>
              {element}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

export default TableHeadBase;
