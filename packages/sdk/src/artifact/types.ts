export type ArtifactObject = {
  uid: string;
  name: string;
  size: string;
  contentType: string;
  namespaceUid: string;
  creator: string;
  isUploaded: boolean;
  path: string;
  objectExpireDays: number;
  lastModifiedTime: string;
  createdTime: string;
  updatedTime: string;
};

export type GetNamespaceObjectUploadURLRequest = {
  namespaceId: string;
  objectName: string;
  urlExpireDays?: number;
  lastModifiedTime?: string;
  objectExpireDays?: number;
};

export type GetObjectUploadURLResponse = {
  uploadUrl: string;
  urlExpireAt: string;
  object: ArtifactObject;
};

export type UploadNamespaceObjectRequest = {
  uploadUrl: string;
  object: Blob;
  /** MIME type of the object */
  contentType?: string;
};

export type GetNamespaceObjectDownloadURLRequest = {
  namespaceId: string;
  objectUid: string;
  urlExpireDays?: number;
};

export type GetNamespaceObjectDownloadURLResponse = {
  downloadUrl: string;
  urlExpireAt: string;
  object: ArtifactObject;
};

export type DownloadNamespaceObjectRequest = {
  downloadUrl: string;
};
import { GeneralRecord } from "../types";

export type KnowledgeBase = {
  uid: string;
  id: string;
  name: string;
  description: string;
  createTime: string;
  updateTime: string;
  ownerName: string;
  tags: string[];
  convertingPipelines: string[];
  splittingPipelines: string[];
  embeddingPipelines: string[];
  summarizingPipelines: string[];
  downstreamApps: string[];
  totalFiles: number;
  totalTokens: number;
  usedStorage: number;
  // Computed/alias fields for backward compatibility
  knowledgeBaseUid: string; // alias for uid
  knowledgeBaseId: string; // alias for id
  namespaceId: string; // extracted from ownerName
  usage: number; // legacy field
};

export type KnowledgeBaseRunAction =
  | "KNOWLEDGE_BASE_RUN_ACTION_UNSPECIFIED"
  | "KNOWLEDGE_BASE_RUN_ACTION_CREATE"
  | "KNOWLEDGE_BASE_RUN_ACTION_UPDATE"
  | "KNOWLEDGE_BASE_RUN_ACTION_DELETE"
  | "KNOWLEDGE_BASE_RUN_ACTION_CREATE_FILE"
  | "KNOWLEDGE_BASE_RUN_ACTION_PROCESS_FILE"
  | "KNOWLEDGE_BASE_RUN_ACTION_DELETE_FILE";

export type KnowledgeBaseRunStatus =
  | "RUN_STATUS_UNSPECIFIED"
  | "RUN_STATUS_PROCESSING"
  | "RUN_STATUS_COMPLETED"
  | "RUN_STATUS_FAILED"
  | "RUN_STATUS_QUEUED";

export type KnowledgeBaseRunSource =
  | "RUN_SOURCE_UNSPECIFIED"
  | "RUN_SOURCE_CONSOLE"
  | "RUN_SOURCE_API";

export type KnowledgeBaseRun = {
  uid: string;
  knowledgeBaseUid: string;
  fileUids: string[];
  action: KnowledgeBaseRunAction;
  status: KnowledgeBaseRunStatus;
  source: KnowledgeBaseRunSource;
  totalDuration: number;
  runnerId: string;
  namespaceId: string;
  payload: GeneralRecord;
  startTime: string;
  completeTime: string;
  error?: string;
  creditAmount: number;
};

export type FilePosition = {
  unit:
    | "UNIT_UNSPECIFIED"
    | "UNIT_CHARACTER"
    | "UNIT_PAGE"
    | "UNIT_TIME_MS"
    | "UNIT_PIXEL";
  coordinates: number[];
};

export type ChunkReference = {
  start: FilePosition;
  end: FilePosition;
};

export type ChunkType =
  | "TYPE_UNSPECIFIED"
  | "TYPE_CONTENT"
  | "TYPE_SUMMARY"
  | "TYPE_AUGMENTED";

export type Chunk = {
  uid: string;
  retrievable: boolean;
  tokens: number;
  createTime: string;
  originalFileUid: string;
  content: string;
  chunkUid: string; // alias for uid
  type: ChunkType;
  reference?: ChunkReference;
  markdownReference?: ChunkReference;
};

export type GetChunkResponse = {
  chunk: Chunk;
};

export type SimilarChunk = {
  chunkUid: string;
  similarityScore: number;
  textContent: string;
  sourceFile: string;
  chunkMetadata: GeneralRecord;
};

export type FileProcessStatus =
  | "FILE_PROCESS_STATUS_UNSPECIFIED"
  | "FILE_PROCESS_STATUS_NOTSTARTED"
  | "FILE_PROCESS_STATUS_PROCESSING"
  | "FILE_PROCESS_STATUS_CHUNKING"
  | "FILE_PROCESS_STATUS_EMBEDDING"
  | "FILE_PROCESS_STATUS_COMPLETED"
  | "FILE_PROCESS_STATUS_FAILED";

export type FileType =
  | "TYPE_UNSPECIFIED"
  | "TYPE_TEXT"
  | "TYPE_PDF"
  | "TYPE_MARKDOWN"
  | "TYPE_HTML"
  | "TYPE_DOCX"
  | "TYPE_DOC"
  | "TYPE_PPT"
  | "TYPE_PPTX"
  | "TYPE_XLS"
  | "TYPE_XLSX"
  | "TYPE_CSV"
  | "TYPE_PNG"
  | "TYPE_JPEG"
  | "TYPE_JPG"
  | "TYPE_GIF"
  | "TYPE_WEBP"
  | "TYPE_TIFF"
  | "TYPE_BMP"
  | "TYPE_HEIC";

export type File = {
  uid: string;
  id: string;
  name: string;
  filename: string;
  type: FileType;
  processStatus: FileProcessStatus;
  processOutcome: string;
  retrievable: boolean;
  content: string;
  ownerUid: string;
  creatorUid: string;
  knowledgeBaseUid: string;
  createTime: string;
  updateTime: string;
  deleteTime: string;
  size: number;
  totalChunks: number;
  totalTokens: number;
  downloadUrl?: string;
  convertingPipeline?: string;
  tags?: string[];
};

/* ----------------------------------------------------------------------------
 * Knowledge Base Requests/Responses
 * ---------------------------------------------------------------------------*/

export type ListKnowledgeBasesRequest = {
  namespaceId: string;
  pageSize?: number;
  pageToken?: string;
};

export type ListKnowledgeBasesResponse = {
  knowledgeBases: KnowledgeBase[];
  nextPageToken: string;
  totalSize: number;
};

export type CreateKnowledgeBaseRequest = {
  namespaceId: string;
  id?: string;
  description?: string;
  tags?: string[];
  convertingPipelines?: string[];
};

export type CreateKnowledgeBaseResponse = {
  knowledgeBase: KnowledgeBase;
};

export type UpdateKnowledgeBaseRequest = {
  namespaceId: string;
  knowledgeBaseId: string;
  knowledgeBase: {
    description?: string;
    tags?: string[];
    convertingPipelines?: string[];
  };
  updateMask?: string;
};

export type UpdateKnowledgeBaseResponse = {
  knowledgeBase: KnowledgeBase;
};

export type DeleteKnowledgeBaseRequest = {
  namespaceId: string;
  knowledgeBaseId: string;
};

/* ----------------------------------------------------------------------------
 * File Requests/Responses
 * ---------------------------------------------------------------------------*/

export type CreateFileRequest = {
  namespaceId: string;
  knowledgeBaseId: string;
  file: {
    filename?: string;
    type?: FileType;
    content?: string;
    objectUid?: string;
    convertingPipeline?: string;
    tags?: string[];
  };
};

export type CreateFileResponse = {
  file: File;
};

export type FileView =
  | "VIEW_UNSPECIFIED"
  | "VIEW_BASIC"
  | "VIEW_FULL"
  | "VIEW_SUMMARY"
  | "VIEW_CONTENT"
  | "VIEW_STANDARD_FILE_TYPE"
  | "VIEW_ORIGINAL_FILE_TYPE"
  | "VIEW_CACHE";

export type GetFileRequest = {
  namespaceId: string;
  knowledgeBaseId: string;
  fileId: string;
  view?: FileView;
};

export type GetFileResponse = {
  file: File;
  derivedResourceUri?: string;
};

export type ListFilesRequest = {
  namespaceId: string;
  knowledgeBaseId: string;
  pageSize?: number;
  pageToken?: string;
};

export type ListFilesResponse = {
  files: File[];
  nextPageToken: string;
  totalSize: number;
};

export type UpdateFileRequest = {
  namespaceId: string;
  knowledgeBaseId: string;
  fileId: string;
  file?: Partial<File>;
};

export type UpdateFileResponse = {
  file: File;
};

export type DeleteFileRequest = {
  namespaceId: string;
  knowledgeBaseId: string;
  fileId: string;
};

/* ----------------------------------------------------------------------------
 * Chunk Requests/Responses
 * ---------------------------------------------------------------------------*/

export type GetChunkRequest = {
  namespaceId: string;
  knowledgeBaseId: string;
  fileId: string;
  chunkId: string;
  chunkType?: ChunkType;
};

export type ListChunksRequest = {
  namespaceId: string;
  knowledgeBaseId: string;
  fileId: string;
  pageSize?: number;
  pageToken?: string;
};

export type ListChunksResponse = {
  chunks: Chunk[];
  nextPageToken: string;
  totalSize: number;
};

export type UpdateChunkRequest = {
  namespaceId: string;
  knowledgeBaseId: string;
  chunkId: string;
  retrievable?: boolean;
};

export type UpdateChunkResponse = {
  chunk: Chunk;
};

export type SearchChunksRequest = {
  namespaceId: string;
  knowledgeBaseId: string;
  textPrompt?: string;
  topK?: number;
  requesterUid?: string;
};

export type SearchChunksResponse = {
  similarChunks: SimilarChunk[];
};

/* ----------------------------------------------------------------------------
 * Knowledge Base Run Requests/Responses
 * ---------------------------------------------------------------------------*/

export type ListKnowledgeBaseRunsRequest = {
  namespaceId: string;
  knowledgeBaseId: string;
  pageSize?: number;
  page?: number;
  filter?: string;
  orderBy?: string;
};

export type ListKnowledgeBaseRunsResponse = {
  knowledgeBaseRuns: KnowledgeBaseRun[];
  totalSize: number;
  pageSize: number;
  page: number;
};
