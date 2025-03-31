import { GeneralRecord } from "../types";

export type Catalog = {
  chunks: Chunk[];
  usage: number;
  catalogId: string;
  name: string;
  description: string;
  createTime: string;
  updateTime: string;
  ownerName: string;
  tags: string[];
  convertingPipelines: string[];
  splittingPipelines: string[];
  embeddingPipelines: string[];
  downstreamApps: string[];
  totalFiles: number;
  totalTokens: number;
  usedStorage: number;
  namespaceId: string;
  catalogUid: string;
};

export type CatalogRunAction =
  | "CATALOG_RUN_ACTION_CREATE"
  | "CATALOG_RUN_ACTION_UPDATE"
  | "CATALOG_RUN_ACTION_DELETE"
  | "CATALOG_RUN_ACTION_CREATE_FILE"
  | "CATALOG_RUN_ACTION_PROCESS_FILE"
  | "CATALOG_RUN_ACTION_DELETE_FILE";

export type CatalogRunStatus =
  | "RUN_STATUS_PROCESSING"
  | "RUN_STATUS_COMPLETED"
  | "RUN_STATUS_FAILED"
  | "RUN_STATUS_QUEUED";

export type CatalogRunSource = "RUN_SOURCE_CONSOLE" | "RUN_SOURCE_API";

export type CatalogRun = {
  uid: string;
  catalogUid: string;
  fileUids: string[];
  action: CatalogRunAction;
  status: CatalogRunStatus;
  source: CatalogRunSource;
  totalDuration: number;
  runnerId: string;
  namespaceId: string;
  payload: GeneralRecord;
  startTime: string;
  completeTime: string;
  error?: string;
  creditAmount: number;
};

export type Chunk = {
  chunkUid: string;
  content: string;
  retrievable: boolean;
  tokens: number;
  startPos: number;
  endPos: number;
  originalFileUid: string;
  type: string;
};

export type SimilarChunk = {
  chunkUid: string;
  similarityScore: number;
  textContent: string;
  sourceFile: string;
  chunkMetadata: GeneralRecord;
};

export type FileStatus =
  | "FILE_PROCESS_STATUS_NOTSTARTED"
  | "FILE_PROCESS_STATUS_WAITING"
  | "FILE_PROCESS_STATUS_CONVERTING"
  | "FILE_PROCESS_STATUS_CHUNKING"
  | "FILE_PROCESS_STATUS_EMBEDDING"
  | "FILE_PROCESS_STATUS_COMPLETED"
  | "FILE_PROCESS_STATUS_FAILED";

export type FileType =
  | "FILE_TYPE_TEXT"
  | "FILE_TYPE_PDF"
  | "FILE_TYPE_MARKDOWN"
  | "FILE_TYPE_HTML"
  | "FILE_TYPE_DOCX"
  | "FILE_TYPE_DOC"
  | "FILE_TYPE_PPT"
  | "FILE_TYPE_PPTX"
  | "FILE_TYPE_XLS"
  | "FILE_TYPE_XLSX"
  | "FILE_TYPE_CSV"
  | "FILE_TYPE_UNSPECIFIED";

export type File = {
  fileUid: string;
  name: string;
  type: string;
  processStatus: FileStatus;
  processOutcome: string;
  retrievable: boolean;
  content: string;
  ownerUid: string;
  creatorUid: string;
  kbUid: string;
  createTime: string;
  updateTime: string;
  deleteTime: string;
  size: number;
  totalChunks: number;
  totalTokens: number;
  summary: string;
  downloadUrl: string;
};

export type FileContent = {
  content: string;
};

export type CatalogFile = {
  fileUid: string;
  name: string;
  type: string;
  processStatus?: string;
  processOutcome?: string;
  retrievable?: boolean;
};

export type ListNamespaceCatalogsRequest = {
  namespaceId: string;
};

export type ListCatalogsResponse = {
  catalogs: Catalog[];
  nextPageToken: string;
  totalSize: number;
};

export type CreateNamespaceCatalogRequest = {
  namespaceId: string;
  name: string;
  description?: string;
  tags?: string[];
};

export type CreateNamespaceCatalogResponse = {
  catalog: Catalog;
};

export type UpdateNamespaceCatalogRequest = {
  namespaceId: string;
  catalogId: string;
  description?: string;
  tags?: string[];
};

export type UpdateNamespaceCatalogResponse = {
  catalog: Catalog;
};

export type DeleteNamespaceCatalogRequest = {
  namespaceId: string;
  catalogId: string;
};

export type GetNamespaceCatalogSingleSourceOfTruthFileRequest = {
  namespaceId: string;
  catalogId: string;
  fileUid: string;
};

export type GetNamespaceCatalogSingleSourceOfTruthFileResponse = {
  sourceFile: FileContent;
};

export type CreateNamespaceCatalogFileRequest = {
  namespaceId: string;
  catalogId: string;
  name?: string;
  type?: FileType;
  content?: string;
  objectUid?: string;
};

export type CreateNamespaceCatalogFileResponse = {
  file: File;
};

export type GetNamespaceCatalogFileRequest = {
  namespaceId: string;
  catalogId: string;
  fileUid: string;
};

export type GetNamespaceCatalogFileResponse = {
  file: File;
};

export type ListPaginatedNamespaceCatalogFilesRequest = {
  namespaceId: string;
  catalogId: string;
  pageSize?: number;
  pageToken?: string;
};

export type ListPaginatedNamespaceCatalogFilesResponse = {
  files: File[];
  nextPageToken: string;
  totalSize: number;
};

export type ListNamespaceCatalogFilesRequest = {
  namespaceId: string;
  catalogId: string;
  pageSize?: number;
  pageToken?: string;
};

export type ListNamespaceCatalogFilesResponse = File[];

export type DeleteCatalogFileRequest = {
  fileUid: string;
};

export type ProcessCatalogFilesRequest = {
  fileUids: string[];
  requesterUid?: string;
};

export type ProcessCatalogFilesResponse = {
  files: File[];
};

export type ListNamespaceCatalogChunksRequest = {
  namespaceId: string;
  catalogId: string;
  fileUid?: string;
  chunkUids?: string[];
};

export type ListNamespaceCatalogChunksResponse = {
  chunks: Chunk[];
};

export type UpdateCatalogChunkRequest = {
  chunkUid: string;
  retrievable: boolean;
};

export type UpdateCatalogChunkResponse = {
  chunk: Chunk;
};

export type RetrieveSimilarNamespaceCatalogChunksRequest = {
  namespaceId: string;
  catalogId: string;
  textPrompt?: string;
  topK?: number;
  requesterUid?: string;
};

export type RetrieveSimilarNamespaceCatalogChunksResponse = {
  similarChunks: SimilarChunk[];
};

export type AskNamespaceCatalogQuestionRequest = {
  namespaceId: string;
  catalogId: string;
  question?: string;
  topK?: number;
  requesterUid?: string;
};

export type AskNamespaceCatalogQuestionResponse = {
  answer: {
    similarChunks: SimilarChunk[];
  };
};

export type ListNamespaceCatalogRunsRequest = {
  namespaceId: string;
  catalogId: string;
  pageSize?: number;
  page?: number;
  filter?: string;
  orderBy?: string;
};

export type ListNamespaceCatalogRunsResponse = CatalogRun[];

export type ListPaginatedNamespaceCatalogRunsRequest = {
  namespaceId: string;
  catalogId: string;
  pageSize?: number;
  page?: number;
  filter?: string;
  orderBy?: string;
};

export type ListPaginatedNamespaceCatalogRunsResponse = {
  catalogRuns: CatalogRun[];
  totalSize: number;
  pageSize: number;
  page: number;
};

export type GetCatalogFileSummaryRequest = {
  namespaceId: string;
  catalogId: string;
  fileUid: string;
};

export type GetCatalogFileSummaryResponse = {
  summary: string;
};
