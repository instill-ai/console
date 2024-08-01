export type KnowledgeBase = {
  chunks: Chunk[];
  usage: number;
  kbId: string;
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
};

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

export type SourceFile = {
  content: string;
};

export type SimilarityChunk = {
  chunkUid: string;
  content: string;
  score: number;
};

export interface CreateKnowledgeBaseRequest {
  ownerId: string;
  payload: {
    id: string;
    name: string;
    description?: string;
  };
}

export interface UpdateKnowledgeBaseRequest {
  ownerId: string;
  kbId: string;
  payload: {
    name?: string;
    description?: string;
  };
}

export interface DeleteKnowledgeBaseRequest {
  ownerId: string;
  kbId: string;
}

export interface ListKnowledgeBasesRequest {
  ownerId: string;
  pageSize?: number;
  pageToken?: string;
}

export interface ListKnowledgeBasesResponse {
  knowledgeBases: KnowledgeBase[];
  nextPageToken: string;
  totalSize: number;
}

export interface UploadKnowledgeBaseFileRequest {
  ownerId: string;
  kbId: string;
  payload: {
    name: string;
    type: string;
    content: string;
  };
}

export interface DeleteKnowledgeBaseFileRequest {
  ownerId: string;
  kbId: string;
  fileUid: string;
}

export interface ListKnowledgeBaseFilesRequest {
  ownerId: string;
  kbId: string;
  pageSize?: number;
  pageToken?: string;
}

export interface ListKnowledgeBaseFilesResponse {
  files: File[];
  nextPageToken: string;
  totalSize: number;
}

export interface ListChunksRequest {
  ownerId: string;
  kbId: string;
  fileUid?: string;
  pageSize?: number;
  pageToken?: string;
}

export interface ListChunksResponse {
  chunks: Chunk[];
  nextPageToken: string;
  totalSize: number;
}

export interface UpdateChunkRequest {
  chunkUid: string;
  retrievable: boolean;
}

export interface GetChunkContentRequest {
  ownerId: string;
  kbId: string;
  chunkUid: string;
}

export interface GetFileContentRequest {
  ownerId: string;
  kbId: string;
  fileUid: string;
}

export interface GetFileDetailsRequest {
  ownerId: string;
  kbId: string;
  fileUid: string;
}

export interface GetSourceFileRequest {
  ownerId: string;
  kbId: string;
  fileUid: string;
}

export interface ProcessKnowledgeBaseFilesRequest {
  fileUids: string[];
}

export interface SimilarityChunksSearchRequest {
  ownerId: string;
  kbId: string;
  payload: {
    query: string;
    topK?: number;
  };
}
