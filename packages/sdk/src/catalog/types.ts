export type Catalog = {
  catalogId: string;
  name: string;
  description: string;
  createTime: string;
  updateTime: string;
  ownerName: string;
  tags: string[];
  id: string;
  uid: string;
  catalogUid: string;
  totalTokens: number;
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
