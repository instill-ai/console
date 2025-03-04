import { Cell, NumberCell, StringCell, BooleanCell, FileCell } from "../table";

export function isStringCell(cell: Cell): cell is StringCell {
  return cell.type === "string";
}

export function isNumberCell(cell: Cell): cell is NumberCell {
  return cell.type === "number";
}

export function isBooleanCell(cell: Cell): cell is BooleanCell {
  return cell.type === "boolean";
}

export function isFileCell(cell: Cell): cell is FileCell {
  return cell.type === "file";
}
