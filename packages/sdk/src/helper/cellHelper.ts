import {
  Cell,
  NumberCell,
  StringCell,
  BooleanCell,
  FileCell,
  DocumentCell,
  ImageCell,
  VideoCell,
  AudioCell,
} from "../table";

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

export function isDocumentCell(cell: Cell): cell is DocumentCell {
  return cell.type === "document";
}

export function isImageCell(cell: Cell): cell is ImageCell {
  return cell.type === "image";
}

export function isVideoCell(cell: Cell): cell is VideoCell {
  return cell.type === "video";
}

export function isAudioCell(cell: Cell): cell is AudioCell {
  return cell.type === "audio";
}
