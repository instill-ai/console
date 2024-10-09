import { Nullable, Permission } from "../types";

export type Application = {
  name: string;
  uid: string;
  id: string;
  description: Nullable<string>;
  createTime: string;
  updateTime: Nullable<string>;
  deleteTime: Nullable<string>;
  ownerName: string;
  owner: {
    user?: {
      name: string;
      id: string;
    };
    organization?: {
      name: string;
      id: string;
    };
  };
  permission: Permission;
  appId: string;
  appUid: string;
  tags?: string[];
  namespaceId?: string;
  ownerUid?: string;
};

export type ListApplicationsRequest = {
  ownerId: string;
  pageSize?: Nullable<number>;
  pageToken?: Nullable<string>;
  view?: Nullable<string>;
};

export type ListApplicationsResponse = {
  apps: Application[];
  nextPageToken: Nullable<string>;
  totalSize: number;
};

export type GetApplicationRequest = {
  applicationName: string;
};

export type GetApplicationResponse = {
  app: Application;
};

export type CreateApplicationRequest = {
  ownerId: string;
  id: string;
  description?: Nullable<string>;
};

export type CreateApplicationResponse = {
  app: Application;
};

export type UpdateApplicationRequest = {
  ownerId: string;
  appId: string;
  newAppId?: Nullable<string>;
  newDescription?: Nullable<string>;
  newTags?: Nullable<string[]>;
};

export type UpdateApplicationResponse = {
  app: Application;
};

export type DeleteApplicationRequest = {
  ownerId: string;
  appId: string;
};

export type SimilarityChunk = {
  id: string;
  content: string;
  fileName: string;
  score: number;
  metadata: Record<string, string>;
  fileType: string;
  text_content: string;
  source_file: string;
  chunk_uid: string;
  similarity_score: number;
  chunk_metadata: {
    original_file_uid: string;
    start_char_offset: number;
    end_char_offset: number;
    start_pos: number;
    end_pos: number;
  };
};

export type Conversation = {
  uid: string;
  namespaceId: string;
  appId: string;
  id: string;
  createTime?: string;
  updateTime: string;
  messages: Message[];
  lastUsedCatalogUid: string;
  lastUsedTopK: number;
};

export enum MessageType {
  TEXT = "MESSAGE_TYPE_TEXT",
}

export type Message = {
  uid: string;
  appUid: string;
  conversationUid: string;
  content: string;
  role: string;
  type: MessageType;
  createTime: string;
  updateTime: string;
  msgSenderUid: string;
  outputs: unknown[]; // need to change it to a proper type
  chunks?: SimilarityChunk[];
  senderProfiles?: [];
};

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

export type CreateConversationRequest = {
  ownerId: string;
  appId: string;
  payload: { conversationId: string };
};

export type GetPlaygroundConversationRequest = {
  ownerId: string;
  appId: string;
};

export type ChatRequest = {
  ownerId: string;
  appId: string;
  catalogId: string;
  conversationUid: string;
  message: string;
  topK?: number;
  namespaceId?: string;
};

export type ListMessagesRequest = {
  ownerId: string;
  appId: string;
  conversationId: string;
};

export type RestartPlaygroundConversationRequest = {
  ownerId: string;
  appId: string;
};

export type UpdateConversationRequest = {
  namespaceId: string;
  appId: string;
  conversationId: string;
  payload: {
    newConversationId: string;
    lastUsedCatalogUid: string | undefined;
    lastUsedTopK: number;
  };
};

export type GetCatalogsRequest = {
  ownerId: string;
};

export type GetFileContentRequest = {
  ownerId: string;
  catalogId: string;
  fileUid: string;
};
