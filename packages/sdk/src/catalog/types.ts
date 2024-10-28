import { Nullable } from "../types";

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
  ownerId: string;
  catalogUid: string;
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

export type FileStatus =
  | "FILE_PROCESS_STATUS_NOTSTARTED"
  | "FILE_PROCESS_STATUS_WAITING"
  | "FILE_PROCESS_STATUS_CONVERTING"
  | "FILE_PROCESS_STATUS_CHUNKING"
  | "FILE_PROCESS_STATUS_EMBEDDING"
  | "FILE_PROCESS_STATUS_COMPLETED"
  | "FILE_PROCESS_STATUS_FAILED";

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
};

export type FileSnippet = {
  id: string;
  content: string;
  fileName: string;
  sectionTitle: string;
  chapters: string[][];
  score: number;
};

export type CatalogFile = {
  fileUid: string;
  name: string;
  type: string;
  processStatus?: string;
  processOutcome?: string;
  retrievable?: boolean;
};

export type ListCatalogsRequest = {
  ownerId: string;
  pageSize?: number;
  pageToken?: string;
  view?: string;
};

export type ListCatalogsResponse = {
  catalogs: Catalog[];
  nextPageToken: string;
  totalSize: number;
};

export type CreateCatalogRequest = {
  ownerId: string;
  payload: {
    name: string;
    description?: string;
    tags?: string[];
    ownerId: string;
  };
};

export type UpdateCatalogRequest = {
  ownerId: string;
  catalogId: string;
  description?: string;
};

export type DeleteCatalogRequest = {
  ownerId: string;
  catalogId: string;
};

export type UploadCatalogFileRequest = {
  ownerId: string;
  catalogId: string;
  payload: {
    name: string;
    type: string;
    content: string;
  };
};

export type ListCatalogFilesRequest = {
  ownerId: string;
  catalogId: string;
  pageSize?: number;
  pageToken?: string;
};

export type ListCatalogFilesResponse = {
  files: File[];
  nextPageToken: string;
  totalSize: number;
};

export type DeleteCatalogFileRequest = {
  fileUid: string;
};

export type GetFileDetailsRequest = {
  ownerId: string;
  catalogId: string;
  fileId: string;
};

export type GetFileContentRequest = {
  ownerId: string;
  catalogId: string;
  fileUid: string;
};

export type FileContent = {
  content: string;
};

export type ProcessCatalogFilesRequest = {
  fileUids: string[];
  namespaceUid: Nullable<string>;
};

export type ListChunksRequest = {
  namespaceId: string;
  catalogId: string;
  fileUid: string;
  pageSize?: number;
  pageToken?: string;
};

export type ListChunksResponse = {
  chunks: Chunk[];
  nextPageToken: string;
  totalSize: number;
};

export type GetChunkContentRequest = {
  namespaceId: string;
  catalogId: string;
  chunkUid: string;
};

export type UpdateChunkRequest = {
  chunkUid: string;
  retrievable: boolean;
};

export type ChunkContent = {
  content: string;
};
