export type KnowledgeBase = {
  chunks: any;
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
  totalFiles: number
}

export type FileSnippet = {
  id: string;
  content: string;
  fileName: string;
  sectionTitle: string;
  chapters: string[][];
  score: number;
};

export interface KnowledgeFile {
  fileUid: string;
  name: string;
  type: string;
  processStatus?: string;
  processOutcome?: string;
  retrievable?: boolean;
}

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
};

export type FileStatus =
  | "FILE_PROCESS_STATUS_NOTSTARTED"
  | "FILE_PROCESS_STATUS_WAITING"
  | "FILE_PROCESS_STATUS_CONVERTING"
  | "FILE_PROCESS_STATUS_CHUNKING"
  | "FILE_PROCESS_STATUS_EMBEDDING"
  | "FILE_PROCESS_STATUS_COMPLETED"
  | "FILE_PROCESS_STATUS_FAILED";
