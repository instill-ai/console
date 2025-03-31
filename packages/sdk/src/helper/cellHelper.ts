import { Cell, NumberCell, StringCell, BooleanCell, FileCell } from "../table";

export function isStringCell(cell: Cell): cell is StringCell {
  return cell.type === "TYPE_STRING";
}

export function isNumberCell(cell: Cell): cell is NumberCell {
  return cell.type === "TYPE_NUMBER";
}

export function isBooleanCell(cell: Cell): cell is BooleanCell {
  return cell.type === "TYPE_BOOLEAN";
}

export function isFileCell(cell: Cell): cell is FileCell {
  return cell.type === "TYPE_FILE";
}
