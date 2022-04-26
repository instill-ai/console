import { FC, ReactNode } from "react";
import { Item } from "./Table";

type TableHeadProps = {
  items: Item[];
};

const TableHead: FC<TableHeadProps> = ({ items }) => {
  return (
    <thead>
      <tr>
        {items.map((e) => (
          <th key={e.key}>{e.item}</th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHead;
