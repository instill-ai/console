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

export type KnowledgeBase = {
  // Canonical resource name. Format: `namespaces/{namespace}/knowledgeBases/{knowledge_base}`
  name: string;
  // Immutable canonical resource ID
  id: string;
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
  // Resource name. Format: `namespaces/{namespace}/knowledgeBases/{knowledge_base}/files/{file}/chunks/{chunk}`
  name: string;
  // Chunk ID (unique identifier)
  id: string;
  retrievable: boolean;
  tokens: number;
  createTime: string;
  // Resource name of the original file this chunk belongs to
  // Format: `namespaces/{namespace}/knowledgeBases/{knowledge_base}/files/{file}`
  originalFile: string;
  type: ChunkType;
  reference?: ChunkReference;
  markdownReference?: ChunkReference;
};

export type GetChunkResponse = {
  chunk: Chunk;
};

export type SimilarChunk = {
  // Chunk resource name. Format: `namespaces/{namespace}/knowledgeBases/{knowledge_base}/files/{file}/chunks/{chunk}`
  chunk: string;
  similarityScore: number;
  textContent: string;
  // Source file resource name. Format: `namespaces/{namespace}/knowledgeBases/{knowledge_base}/files/{file}`
  file: string;
  // Full chunk metadata
  chunkMetadata: Chunk;
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
  // Text-based document types
  | "TYPE_TEXT"
  | "TYPE_MARKDOWN"
  | "TYPE_HTML"
  | "TYPE_CSV"
  // Container-based document types
  | "TYPE_PDF"
  | "TYPE_DOC"
  | "TYPE_DOCX"
  | "TYPE_PPT"
  | "TYPE_PPTX"
  | "TYPE_XLS"
  | "TYPE_XLSX"
  // Image types
  | "TYPE_PNG"
  | "TYPE_JPEG"
  | "TYPE_GIF"
  | "TYPE_WEBP"
  | "TYPE_TIFF"
  | "TYPE_BMP"
  | "TYPE_HEIC"
  | "TYPE_HEIF"
  | "TYPE_AVIF"
  // Audio types
  | "TYPE_MP3"
  | "TYPE_WAV"
  | "TYPE_AAC"
  | "TYPE_OGG"
  | "TYPE_FLAC"
  | "TYPE_M4A"
  | "TYPE_WMA"
  | "TYPE_AIFF"
  | "TYPE_WEBM_AUDIO"
  // Video types
  | "TYPE_MP4"
  | "TYPE_AVI"
  | "TYPE_MOV"
  | "TYPE_MKV"
  | "TYPE_FLV"
  | "TYPE_WMV"
  | "TYPE_MPEG"
  | "TYPE_WEBM_VIDEO";

export type FileMediaType =
  | "FILE_MEDIA_TYPE_UNSPECIFIED"
  | "FILE_MEDIA_TYPE_DOCUMENT"
  | "FILE_MEDIA_TYPE_IMAGE"
  | "FILE_MEDIA_TYPE_AUDIO"
  | "FILE_MEDIA_TYPE_VIDEO";

export type File = {
  // ===== Standard AIP fields =====
  // Canonical resource name. Format: `namespaces/{namespace}/knowledgeBases/{knowledge_base}/files/{file}`
  name: string;
  // Immutable canonical resource ID (e.g., "file-8f3a2k9E7c1")
  id: string;
  // Human-readable display name (filename) for UI
  displayName: string;
  // URL-friendly slug (optional)
  slug?: string;
  // Previous slugs for backward compatibility
  aliases?: string[];
  // Optional description
  description?: string;

  // ===== Timestamps =====
  createTime: string;
  updateTime: string;
  deleteTime?: string;

  // ===== Resource-specific fields =====
  type: FileType;
  processStatus: FileProcessStatus;
  processOutcome: string;
  size: number;
  totalChunks: number;
  totalTokens: number;
  tags?: string[];
  // Custom metadata provided by the user during file upload
  externalMetadata?: Record<string, unknown>;

  // ===== Knowledge base associations =====
  // Knowledge base resource names that this file is associated with
  // Format: `namespaces/{namespace}/knowledgeBases/{knowledge_base}`
  knowledgeBases?: string[];

  // ===== Owner and creator references =====
  // Resource name of the owner namespace. Format: `namespaces/{namespace}`
  ownerName?: string;
  // Full resource name of the user who created this file. Format: `users/{user}`
  creatorName?: string;

  // ===== Upload and content fields =====
  // Base64-encoded file content (input only, for inline upload)
  content?: string;
  // Pre-signed download URL for the file
  downloadUrl?: string;
  // Pipeline used for converting the file to Markdown
  convertingPipeline?: string;
  // Length of the file in the specified unit type
  length?: FilePosition;
  // Collection resource names that this file belongs to
  // Format: `namespaces/{namespace}/collections/{collection}`
  collections?: string[];
  // Object resource name for blob storage upload. Format: `namespaces/{namespace}/objects/{object}`
  object?: string;
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
    // Human-readable display name (filename) for the file (required)
    displayName: string;
    // URL-friendly slug (optional, server generates from displayName if omitted)
    slug?: string;
    // Optional description
    description?: string;
    // File type
    type?: FileType;
    // Base64-encoded file content for inline upload (alternative to object)
    content?: string;
    // Object resource name for blob storage upload. Format: `namespaces/{namespace}/objects/{object}`
    // When provided, the 'content' field is ignored
    object?: string;
    // Pipeline used for converting the file to Markdown
    convertingPipeline?: string;
    // Array of tags associated with the file
    tags?: string[];
    // Custom metadata provided by the user during file upload
    externalMetadata?: Record<string, unknown>;
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

export type FileStorageProvider =
  | "STORAGE_PROVIDER_UNSPECIFIED"
  | "STORAGE_PROVIDER_MINIO"
  | "STORAGE_PROVIDER_GCS";

export type GetFileRequest = {
  namespaceId: string;
  knowledgeBaseId: string;
  fileId: string;
  view?: FileView;
  // Storage provider specifies which storage backend to use for the file resource.
  // Only applicable for views that return file content (VIEW_SUMMARY, VIEW_CONTENT, etc.)
  storageProvider?: FileStorageProvider;
};

export type GetFileResponse = {
  file: File;
  // Derived resource URI based on view and storage provider:
  // - VIEW_SUMMARY/CONTENT/STANDARD_FILE_TYPE/ORIGINAL_FILE_TYPE: Pre-signed URL
  // - VIEW_CACHE: Gemini/VertexAI cache resource name
  derivedResourceUri?: string;
};

export type ListFilesRequest = {
  namespaceId: string;
  knowledgeBaseId: string;
  pageSize?: number;
  pageToken?: string;
  // Filter expression (AIP-160 compliant)
  // Examples:
  // - `id="uuid1" OR id="uuid2"` - Filter by specific file IDs
  // - `process_status="FILE_PROCESS_STATUS_COMPLETED"` - Filter by processing status
  filter?: string;
};

export type ListFilesResponse = {
  files: File[];
  nextPageToken?: string;
  totalSize: number;
  pageSize?: number;
};

export type UpdateFileRequest = {
  namespaceId: string;
  knowledgeBaseId: string;
  fileId: string;
  file: {
    // Fields that can be updated
    displayName?: string;
    slug?: string;
    description?: string;
    tags?: string[];
    externalMetadata?: Record<string, unknown>;
    convertingPipeline?: string;
  };
  // The update mask specifies the subset of fields that should be modified
  // e.g., ["displayName", "description", "tags"]
  updateMask?: string[];
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
  // Optional chunk type filter. If specified, returns a chunk of this type
  // from the same file. If not specified, returns the chunk identified by ID.
  chunkType?: ChunkType;
};

export type ListChunksRequest = {
  namespaceId: string;
  knowledgeBaseId: string;
  fileId: string;
  pageSize?: number;
  pageToken?: string;
  // Filter expression (AIP-160 compliant)
  // Examples:
  // - `id="uuid1" OR id="uuid2"` - Filter by specific chunk IDs
  // - `chunk_type="CHUNK_TYPE_TEXT"` - Filter by chunk type
  // - `retrievable=true` - Filter by retrievable status
  filter?: string;
};

export type ListChunksResponse = {
  chunks: Chunk[];
  nextPageToken?: string;
  totalSize?: number;
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
  // Knowledge base ID to filter by (optional)
  knowledgeBaseId?: string;
  // Text prompt to look for similarities (required)
  textPrompt: string;
  // Top K results. Default: 5
  topK?: number;
  // Chunk type filter
  type?: ChunkType;
  // File media type filter
  fileMediaType?: FileMediaType;
  // File IDs to filter by (optional, OR logic)
  fileIds?: string[];
  // Tags to filter by (optional, OR logic)
  // Note: File filter takes precedence over tags, as tags apply to files
  tags?: string[];
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
