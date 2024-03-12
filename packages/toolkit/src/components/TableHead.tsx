"use client";

import cn from "clsx";

export type TableHeadItem = {
  key: string;
  item: string | React.ReactNode;
  width: string;
};

export type TableHeadProps = {
  items: TableHeadItem[];
  bgColor: string;
  borderColor: string;
};

export const TableHead = ({ items, bgColor, borderColor }: TableHeadProps) => {
  return (
    <thead className={cn("border", borderColor, bgColor)}>
      <tr>
        {items.map((e, index) => {
          const element =
            typeof e.item === "string" ? (
              <p className="text-instillGrey90 text-instill-body flex">
                {e.item}
              </p>
            ) : (
              e.item
            );

          if (index === 0) {
            return (
              <th className={cn("py-1 pl-6", e.width)} key={e.key}>
                {element}
              </th>
            );
          }

          if (index === items.length - 1) {
            return (
              <th className={cn("py-1 pr-6", e.width)} key={e.key}>
                {element}
              </th>
            );
          }

          return (
            <th className={cn("py-1", e.width)} key={e.key}>
              {element}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};
