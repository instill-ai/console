import { Citation, GeneralRecord, Nullable } from "../types";

export type TableAgentConfig = {
  enableTransparency: boolean;
};

export type TablePermissions = {
  canEdit: boolean;
};

export type Table = {
  uid: string;
  id?: string;
  title?: string;
  description?: string;
  metadata?: GeneralRecord;
  createTime: string;
  updateTime: string;
  agentConfig?: TableAgentConfig;
  draftMode: boolean;
  permission: TablePermissions;
};

export type CreateNamespaceTableRequest = {
  namespaceId: string;
  id: string;
  title?: string;
  description?: string;
  metadata?: GeneralRecord;
  agentConfig?: TableAgentConfig;
  draftMode: boolean;
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
  agentConfig?: TableAgentConfig;
  draftMode?: boolean;
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
  enableAutomaticComputation?: boolean;
  context?: {
    columnUids: string[];
  };
};

export type CellType =
  | "TYPE_UNSPECIFIED"
  | "TYPE_STRING"
  | "TYPE_NUMBER"
  | "TYPE_BOOLEAN"
  | "TYPE_FILE";

export type SelectionType =
  | "SELECTION_TYPE_UNSPECIFIED"
  | "SELECTION_TYPE_NONE"
  | "SELECTION_TYPE_SINGLE";

export type ColumnSelectionNumberOption = {
  numberValue: number;
  color: string;
};

export type ColumnSelectionStringOption = {
  stringValue: string;
  color: string;
};

export type NumberFormatType =
  | "FORMAT_UNSPECIFIED"
  | "FORMAT_PLAIN"
  | "FORMAT_COMMAS"
  | "FORMAT_CURRENCY"
  | "FORMAT_PERCENTAGE";

export type NumberFormat = {
  format?: NumberFormatType;
  decimalPlaces?: number;
  currencyCode?: string;
};

export type ColumnDefinition = {
  columnUid: string;
  name?: string;
  type: CellType;
  autofill: GeneralRecord;
  order: number;
  sort?: ColumnSort;
  agentConfig?: ColumnAgentConfig;
  selection: ColumnSelection;
  numberFormat?: NumberFormat;
  metadata?: GeneralRecord;
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
  | "CELL_STATUS_DATA_UPLOADING"
  | "CELL_STATUS_DATA_PENDING"
  | "CELL_STATUS_DATA_PROCESSING"
  | "CELL_STATUS_DATA_FAILED"
  | "CELL_STATUS_TRANSPARENCY_PENDING"
  | "CELL_STATUS_TRANSPARENCY_PROCESSING"
  | "CELL_STATUS_TRANSPARENCY_FAILED";

export type LockState =
  | "LOCK_STATE_UNSPECIFIED"
  | "LOCK_STATE_LOCKED"
  | "LOCK_STATE_UNLOCKED";

export type FaithfulnessCheckingResult = {
  score: number;
  result: string;
};

export type CellTransparency = {
  text: string;
};

export type ColumnSelectionOption =
  | ColumnSelectionNumberOption
  | ColumnSelectionStringOption;

export type ColumnSelection = {
  type: SelectionType;
  options: ColumnSelectionOption[];
};

export type BaseCell = {
  uid: string;
  columnUid: string;
  rowUid: string;
  updateTime: string;
  createTime: string;
  type: CellType;
  metadata: GeneralRecord;
  status: CellStatus;
  transparency: Nullable<CellTransparency>;
  citations: Citation[];
  lockState: LockState;
};

export type StringCell = BaseCell & {
  stringValue?: {
    userInput?: string;
    computedValue?: string;
  };
};

export type NumberCell = BaseCell & {
  numberValue?: {
    userInput?: number;
    computedValue?: number;
  };
};

export type BooleanCell = BaseCell & {
  booleanValue?: {
    userInput?: boolean;
    computedValue?: boolean;
  };
};

export type FileCell = BaseCell & {
  fileValue?: {
    fileUid?: string;
    name: string;
    mimeType?: string;
    namespace?: string;
    objectUid: string;
    catalogId?: string;
    fileUrl?: string;
  };
};

export type DocumentCell = BaseCell & {
  documentValue?: {
    fileUid?: string;
    name: string;
    mimeType?: string;
    namespace?: string;
    objectUid: string;
    catalogId?: string;
    fileUrl?: string;
  };
};

export type Cell = StringCell | NumberCell | BooleanCell | FileCell;

export type Row = {
  uid: string;
  cells: Record<string, Cell>;
  createTime: string;
  updateTime: string;
  order: number;
};

export type RowForCreateOrUpdate = {
  cells: Record<
    string,
    Omit<Cell, "uid" | "columnUid" | "createTime" | "updateTime">
  >;
};

export type GetNamespaceTableRowRequest = {
  namespaceId: string;
  tableUid: string;
  rowUid: string;
};

export type GetNamespaceTableRowResponse = {
  row: Row;
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
  beforeRowUid?: string;
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

export type RecomputeNamespaceTableColumnRequest = {
  namespaceId: string;
  tableUid: string;
  columnUid: string;
};

export type GetNamespaceTableCellRequest = {
  namespaceId: string;
  tableUid: string;
  rowUid: string;
  cellUid: string;
};

export type GetNamespaceTableCellResponse = {
  cell: Cell;
};

export type UpdateNamespaceTableCellRequest = {
  namespaceId: string;
  tableUid: string;
  rowUid: string;
  cellUid: string;
  cell: Cell;
};

export type UpdateNamespaceTableCellResponse = {
  cell: Cell;
};

export type ResetNamespaceTableCellRequest = {
  namespaceId: string;
  tableUid: string;
  rowUid: string;
  cellUid: string;
};

export type ResetNamespaceTableCellResponse = {
  cell: Cell;
};

export type RecomputeNamespaceTableCellRequest = {
  namespaceId: string;
  tableUid: string;
  rowUid: string;
  cellUid: string;
};

export type RecomputeNamespaceTableCellResponse = {
  cell: Cell;
};

export type LockNamespaceTableCellRequest = {
  namespaceId: string;
  tableUid: string;
  rowUid: string;
  cellUid: string;
};

export type LockNamespaceTableCellResponse = {
  cell: Cell;
};

export type UnlockNamespaceTableCellRequest = {
  namespaceId: string;
  tableUid: string;
  rowUid: string;
  cellUid: string;
};

export type UnlockNamespaceTableCellResponse = {
  cell: Cell;
};

export type TableTemplate = {
  uid: string;
  title: string;
  description: string;
  metadata: GeneralRecord;
  createTime: string;
  updateTime: string;
  agentConfig: TableAgentConfig;
  draftMode: boolean;
  permission: TablePermissions;
};

export type ListPaginatedNamespaceTableTemplatesRequest = {
  namespaceId: string;
  pageToken?: string;
  pageSize?: number;
};

export type ListPaginatedNamespaceTableTemplatesResponse = {
  tables: TableTemplate[];
  nextPageToken?: string;
  total_size?: number;
};

export type ListNamespaceTableTemplatesRequest = {
  namespaceId: string;
  pageToken?: string;
  pageSize?: number;
};

export type ListNamespaceTableTemplatesResponse = {
  tables: TableTemplate[];
};

export type CreateNamespaceTableFromTemplateRequest = {
  namespaceId: string;
  table: {
    title: string;
  };
  templateNamespaceId?: string;
  templateTableUid: string;
};

export type CreateNamespaceTableFromTemplateResponse = {
  table: Table;
};
