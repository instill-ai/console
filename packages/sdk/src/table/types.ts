import { GeneralRecord } from "../types";

export type Table = {
  uid: string;
  id: string;
  title?: string;
  description?: string;
  metadata?: GeneralRecord;
  createTime: string;
  updateTime: string;
};

export type CreateNamespaceTableRequest = {
  namespaceId: string;
  id: string;
  title?: string;
  description?: string;
  metadata?: GeneralRecord;
};

export type CreateNamespaceTableResponse = {
  table: Table;
};

export type GetNamespaceTableRequest = {
  namespaceId: string;
  tableUId: string;
};

export type GetNamespaceTableResponse = {
  table: Table;
};

export type ListPaginatedNamespaceTablesRequest = {
  namespaceId: string;
  pageToken?: string;
  pageSize?: number;
};

export type ListPaginatedNamespaceTablesResponse = {
  tables: Table[];
  nextPageToken?: string;
  total_size?: number;
};

export type ListNamespaceTablesRequest = {
  namespaceId: string;
  pageToken?: string;
  pageSize?: number;
};

export type ListNamespaceTablesResponse = {
  tables: Table[];
};

export type UpdateNamespaceTableRequest = {
  namespaceId: string;
  tableUId: string;
  title?: string;
  description?: string;
  metadata?: GeneralRecord;
};

export type UpdateNamespaceTableResponse = {
  table: Table;
};

export type DeleteNamespaceTableRequest = {
  namespaceId: string;
  tableUId: string;
};

export type ColumnDefinition = {
  columnUid: string;
  type: string;
  autofill: GeneralRecord;
  order: number;
};

export type ColumnDefinitions = Record<string, ColumnDefinition>;

export type GetNamespaceTableColumnDefinitionsRequest = {
  namespaceId: string;
  tableUId: string;
};

export type GetNamespaceTableColumnDefinitionsResponse = {
  columnDefinitions: ColumnDefinitions;
};

export type UpdateNamespaceTableColumnDefinitionsRequest = {
  namespaceId: string;
  tableUId: string;
  columnDefinitions: Record<string, Omit<ColumnDefinition, "columnUid">>;
};

export type UpdateNamespaceTableColumnDefinitionsResponse = {
  columnDefinitions: ColumnDefinitions;
};

export type BaseCell = {
  uid: string;
  columnUid: string;
  updateTime: string;
  createTime: string;
  type: string;
  metadata: GeneralRecord;
};

export type StringCell = BaseCell & {
  stringValue: {
    value: string;
  };
};

export type NumberCell = BaseCell & {
  numberValue: {
    value: number;
  };
};

export type BooleanCell = BaseCell & {
  booleanValue: {
    value: boolean;
  };
};

export type FileCell = BaseCell & {
  fileValue: {
    url: string;
  };
};

export type DocumentCell = BaseCell & {
  documentValue: {
    url: string;
  };
};

export type ImageCell = BaseCell & {
  imageValue: {
    url: string;
  };
};

export type VideoCell = BaseCell & {
  videoValue: {
    url: string;
  };
};

export type AudioCell = BaseCell & {
  audioValue: {
    url: string;
  };
};

export type Cell =
  | StringCell
  | NumberCell
  | BooleanCell
  | FileCell
  | DocumentCell
  | ImageCell
  | VideoCell
  | AudioCell;

export type Row = {
  uid: string;
  cells: Record<string, Cell>;
  createTime: string;
  updateTime: string;
};

export type RowForCreateOrUpdate = {
  cells: Record<
    string,
    Omit<Cell, "uid" | "columnUid" | "createTime" | "updateTime">
  >;
};

export type ListPaginatedNamespaceTableRowsRequest = {
  namespaceId: string;
  tableUId: string;
  pageToken?: string;
  pageSize?: number;
  filter?: string;
  sort?: string;
  datetime?: string;
};

export type ListPaginatedNamespaceTableRowsResponse = {
  rows: Row[];
  nextPageToken?: string;
  totalSize?: number;
};

export type ListNamespaceTableRowsRequest = {
  namespaceId: string;
  tableUId: string;
  pageToken?: string;
  pageSize?: number;
  filter?: string;
  sort?: string;
  datetime?: string;
};

export type ListNamespaceTableRowsResponse = {
  rows: Row[];
};

export type CreateNamespaceTableRowRequest = {
  namespaceId: string;
  tableUId: string;
  row: RowForCreateOrUpdate;
};

export type CreateNamespaceTableRowResponse = {
  row: Row;
};

export type UpdateNamespaceTableRowRequest = {
  namespaceId: string;
  tableUId: string;
  rowUId: string;
  row: RowForCreateOrUpdate;
};

export type UpdateNamespaceTableRowResponse = {
  row: Row;
};

export type DeleteNamespaceTableRowRequest = {
  namespaceId: string;
  tableUId: string;
  rowUId: string;
};

export type MoveNamespaceTableRowRequest = {
  namespaceId: string;
  tableUId: string;
  rowUids: string[];
  afterRowUId?: string;
};
