import { GeneralRecord, Nullable } from "../types";

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
  tableUid: string;
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
  tableUid: string;
  title?: string;
  description?: string;
  metadata?: GeneralRecord;
};

export type UpdateNamespaceTableResponse = {
  table: Table;
};

export type DeleteNamespaceTableRequest = {
  namespaceId: string;
  tableUid: string;
};

export type ColumnSort =
  | "SORT_UNSPECIFIED"
  | "SORT_ASCENDING"
  | "SORT_DESCENDING";

export type ColumnAgentConfig = {
  instructions: string;
  enableWebSearch: boolean;
};

export type ColumnDefinition = {
  columnUid: string;
  name?: string;
  type: string;
  autofill: GeneralRecord;
  order: number;
  sort?: ColumnSort;
  agentConfig?: ColumnAgentConfig;
};

export type ColumnDefinitions = Record<string, ColumnDefinition>;

export type GetNamespaceTableColumnDefinitionsRequest = {
  namespaceId: string;
  tableUid: string;
};

export type GetNamespaceTableColumnDefinitionsResponse = {
  columnDefinitions: ColumnDefinitions;
};

export type UpdateNamespaceTableColumnDefinitionsRequest = {
  namespaceId: string;
  tableUid: string;
  columnDefinitions: Record<string, Omit<ColumnDefinition, "columnUid">>;
};

export type UpdateNamespaceTableColumnDefinitionsResponse = {
  columnDefinitions: ColumnDefinitions;
};

export type CellStatus =
  | "CELL_STATUS_UNSPECIFIED"
  | "CELL_STATUS_IDLE"
  | "CELL_STATUS_PENDING"
  | "CELL_STATUS_PROCESSING"
  | "CELL_STATUS_FAILED"
  | "CELL_STATUS_COMPLETED";

export type FaithfulnessCheckingResult = {
  score: number;
  result: string;
};

export type BaseCell = {
  uid: string;
  columnUid: string;
  updateTime: string;
  createTime: string;
  type: string;
  metadata: GeneralRecord;
  status: CellStatus;
  faithfulnessCheckingResult: Nullable<FaithfulnessCheckingResult>;
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
  tableUid: string;
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
  tableUid: string;
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
  tableUid: string;
  row: RowForCreateOrUpdate;
};

export type CreateNamespaceTableRowResponse = {
  row: Row;
};

export type UpdateNamespaceTableRowRequest = {
  namespaceId: string;
  tableUid: string;
  rowUid: string;
  row: RowForCreateOrUpdate;
};

export type UpdateNamespaceTableRowResponse = {
  row: Row;
};

export type DeleteNamespaceTableRowRequest = {
  namespaceId: string;
  tableUid: string;
  rowUid: string;
};

export type MoveNamespaceTableRowRequest = {
  namespaceId: string;
  tableUid: string;
  rowUids: string[];
  beforeRowUid?: string;
};

export type ExportFormat =
  | "EXPORT_FORMAT_UNSPECIFIED"
  | "EXPORT_FORMAT_CSV"
  | "EXPORT_FORMAT_PARQUET";

export type ExportNamespaceTableRequest = {
  namespaceId: string;
  tableUid: string;
  format: ExportFormat;
};
