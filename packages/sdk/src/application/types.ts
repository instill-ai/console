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
  pageSize?: number;
  pageToken?: string;
  view?: string;
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

export type DeleteApplicationResponse = Record<string, never>;

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

export type CreateApplicationPayload = {
  appId: string;
  name: string;
  description?: string;
  tags?: string[];
  namespaceId: string;
};

export type EditApplicationPayload = {
  appId?: string;
  name?: string;
  description?: Nullable<string>;
  tags?: string[];
};

export type CloneApplicationPayload = {
  appId: string;
  name: string;
  description?: string;
  tags?: string[];
  namespaceId: string;
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
  outputs: unknown[];
  chunks?: SimilarityChunk[];
  senderProfiles?: unknown[];
};

export type CreateConversationRequest = {
  ownerId: string;
  appId: string;
  payload: { conversationId: string };
};

export type CreateConversationResponse = {
  conversation: Conversation;
};

export type GetPlaygroundConversationRequest = {
  ownerId: string;
  appId: string;
};

export type GetPlaygroundConversationResponse = {
  conversation: Conversation;
};

export type ChatRequest = {
  ownerId: string;
  appId: string;
  catalogId: string;
  conversationUid: string;
  message: string;
  accessToken: string;
  topK?: number;
  namespaceUid: Nullable<string> | undefined;
  requesterUid: string;
};

export type ChatResponse = {
  data: ReadableStream<Uint8Array> | null;
  status: number;
  statusText: string;
  headers: Headers;
};

export type ListConversationsRequest = {
  ownerId: string;
  appId: string;
  pageSize?: number;
  pageToken?: string;
  conversationId?: string;
  ifAll?: boolean;
};

export type ListConversationsResponse = {
  conversations: Conversation[];
  nextPageToken: string;
  totalSize: number;
};

export type ListMessagesRequest = {
  ownerId: string;
  appId: string;
  conversationId: string;
  pageSize?: number;
  pageToken?: string;
};

export type ListMessagesResponse = {
  messages: Message[];
  nextPageToken: string;
  totalSize: number;
  senderProfiles: MessageSenderProfile[];
};

export type MessageSenderProfile = {
  msgSenderUid: string;
  msgSenderId: string;
  displayName: string;
  avatar: string;
};

export type CreateMessageRequest = {
  ownerId: string;
  appId: string;
  conversationId: string;
  content: string;
  role: string;
  type: MessageType;
};

export type CreateMessageResponse = {
  message: Message;
};

export type UpdateMessageRequest = {
  ownerId: string;
  appId: string;
  conversationId: string;
  messageUid: string;
  content: string;
};

export type UpdateMessageResponse = {
  message: Message;
};

export type DeleteMessageRequest = {
  ownerId: string;
  appId: string;
  conversationId: string;
  messageUid: string;
};

export type DeleteMessageResponse = Record<string, never>;

export type RestartPlaygroundConversationRequest = {
  ownerId: string;
  appId: string;
};

export type RestartPlaygroundConversationResponse = {
  conversation: Conversation;
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

export type UpdateConversationResponse = {
  conversation: Conversation;
};

export type DeleteConversationRequest = {
  ownerId: string;
  appId: string;
  conversationId: string;
};
