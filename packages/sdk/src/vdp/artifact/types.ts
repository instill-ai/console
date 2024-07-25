export type KnowledgeBase = {
  kbId: string;
  name: string;
  description: string;
  createTime: string;
  updateTime: string;
  ownerName: string;
  tags: string[];
  convertPipelineId: string;
  splitPipelineId: string;
  embeddingPipelineId: string;
  downstreamAiApps: string[];
};

export type File = {
  fileUid: string;
  name: string;
  type: string;
  processStatus: string;
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
};

export type SourceFile = {
  content: string;
};

export type SimilarityChunk = {
  chunkUid: string;
  content: string;
  score: number;
};

export type ListKnowledgeBasesRequest = {
  ownerId: string;
  pageSize?: number;
  pageToken?: string;
};

export type ListKnowledgeBasesResponse = {
  knowledgeBases: KnowledgeBase[];
  nextPageToken: string;
  totalSize: number;
};

export type GetKnowledgeBaseRequest = {
  ownerId: string;
  kbId: string;
};

export type CreateKnowledgeBaseRequest = {
  ownerId: string;
  payload: {
    name: string;
    description: string;
    tags?: string[];
  };
};

export type UpdateKnowledgeBaseRequest = {
  ownerId: string;
  kbId: string;
  payload: {
    name?: string;
    description?: string;
    tags?: string[];
  };
};

export type DeleteKnowledgeBaseRequest = {
  ownerId: string;
  kbId: string;
};

export type ListKnowledgeBaseFilesRequest = {
  ownerId: string;
  kbId: string;
  pageSize?: number;
  pageToken?: string;
};

export type ListKnowledgeBaseFilesResponse = {
  files: File[];
  nextPageToken: string;
  totalSize: number;
};

export type UploadKnowledgeBaseFileRequest = {
  ownerId: string;
  kbId: string;
  payload: {
    name: string;
    type: string;
    content: string;
  };
};

export type DeleteKnowledgeBaseFileRequest = {
  fileUid: string;
};

export type ListChunksRequest = {
  ownerId: string;
  kbId: string;
  fileUid: string;
  pageSize?: number;
  pageToken?: string;
};

export type ListChunksResponse = {
  chunks: Chunk[];
  nextPageToken: string;
  totalSize: number;
};

export type UpdateChunkRequest = {
  chunkUid: string;
  retrievable: boolean;
};

export type GetChunkContentRequest = {
  ownerId: string;
  kbId: string;
  chunkUid: string;
};

export type GetFileContentRequest = {
  ownerId: string;
  kbId: string;
  fileUid: string;
};

export type GetFileDetailsRequest = {
  ownerId: string;
  kbId: string;
  fileUid: string;
};

export type GetSourceFileRequest = {
  ownerId: string;
  kbId: string;
  fileUid: string;
};

export type ProcessKnowledgeBaseFilesRequest = {
  fileUids: string[];
};

export type SimilarityChunksSearchRequest = {
  ownerId: string;
  kbId: string;
  payload: {
    textPrompt: string;
    topk: number;
  };
};