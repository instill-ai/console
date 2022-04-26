import { FC, ReactNode } from "react";
import { Item } from "./Table";

type TableRowProps = {
  rowItems: Item[];
};

const TableRow: FC<TableRowProps> = ({ rowItems }) => {
  return (
    <tr>
      {rowItems.map((e) => (
        <td key={e.key}>{e.item}</td>
      ))}
    </tr>
  );
};

export default TableRow;
