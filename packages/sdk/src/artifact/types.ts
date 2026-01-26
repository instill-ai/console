export type ArtifactObject = {
  // Canonical resource name. Format: `namespaces/{namespace}/objects/{object}`
  name: string;
  // Immutable canonical resource ID (e.g., "obj-3k7m9p2w5t1"). Hash-based, unique within a namespace.
  id: string;
  // Human-readable display name (user-provided filename).
  displayName: string;
  // Resource name of the owner namespace. Format: `namespaces/{namespace}`
  ownerName: string;
  // Full resource name of the user who created this object. Format: `users/{user}`
  creatorName: string;
  // Object creation time.
  createTime: string;
  // Object update time.
  updateTime: string;
  // Size in bytes.
  size: number;
  // Content type (MIME type).
  contentType: string;
  // Whether the file has been uploaded to storage.
  isUploaded: boolean;
  // Object expiration time in days.
  objectExpireDays: number;
  // Last modified time (client-provided metadata).
  lastModifiedTime?: string;
  // Object delete time (for soft delete).
  deleteTime?: string;
};

export type GetNamespaceObjectUploadURLRequest = {
  // The parent resource name. Format: `namespaces/{namespace}`
  parent: string;
  // Display name for the object (user-provided filename, max 1024 characters).
  displayName: string;
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
  // The resource name of the object.
  // Format: `namespaces/{namespace}/objects/{object}`
  name: string;
  // URL expiration time in days. Maximum is 7 days. If set to 0, URL will not expire.
  urlExpireDays?: number;
  // Optional custom filename for the download.
  downloadFilename?: string;
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
  | "TYPE_HEIC"
  | "TYPE_HEIF"
  | "TYPE_AVIF"
  | "TYPE_MP3"
  | "TYPE_WAV"
  | "TYPE_AAC"
  | "TYPE_OGG"
  | "TYPE_FLAC"
  | "TYPE_M4A"
  | "TYPE_WMA"
  | "TYPE_AIFF"
  | "TYPE_MP4"
  | "TYPE_AVI"
  | "TYPE_MOV"
  | "TYPE_WEBM_VIDEO"
  | "TYPE_MKV"
  | "TYPE_FLV"
  | "TYPE_WMV"
  | "TYPE_MPEG";

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

export type GetKnowledgeBaseRequest = {
  namespaceId: string;
  knowledgeBaseId: string;
};

export type GetKnowledgeBaseResponse = {
  knowledgeBase: KnowledgeBase;
};

/* ----------------------------------------------------------------------------
 * File Requests/Responses
 * ---------------------------------------------------------------------------*/

export type CreateFileRequest = {
  namespaceId: string;
  // Knowledge base ID (the ID part, not the full resource name)
  knowledgeBaseId: string;
  file: {
    // Human-readable display name (filename) for the file
    displayName?: string;
    type?: FileType;
    content?: string;
    // Object resource name for blob storage upload. Format: `namespaces/{namespace}/objects/{object}`
    object?: string;
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
  filter?: string;
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

export type ReprocessFileRequest = {
  namespaceId: string;
  knowledgeBaseId: string;
  fileId: string;
};

export type ReprocessFileResponse = {
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
  fileId: string;
  chunkId: string;
  retrievable?: boolean;
};

export type UpdateChunkResponse = {
  chunk: Chunk;
};

export type SearchChunksRequest = {
  namespaceId: string;
  textPrompt?: string;
  topK?: number;
  requesterUid?: string;
  knowledgeBaseUids?: string[];
  fileUids?: string[];
};

export type SearchChunksResponse = {
  similarChunks: SimilarChunk[];
};

/* ----------------------------------------------------------------------------
 * Object Requests/Responses
 * ---------------------------------------------------------------------------*/

export type GetObjectRequest = {
  namespaceId: string;
  objectId: string;
};

export type GetObjectResponse = {
  object: ArtifactObject;
};

export type UpdateObjectRequest = {
  namespaceId: string;
  objectId: string;
  object?: Partial<ArtifactObject>;
};

export type UpdateObjectResponse = {
  object: ArtifactObject;
};

export type DeleteObjectRequest = {
  namespaceId: string;
  objectId: string;
};
