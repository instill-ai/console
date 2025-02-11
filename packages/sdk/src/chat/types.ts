import { Nullable } from "../types";

export type CreateNamespaceChatRequest = {
  namespaceId: string;
  chatDisplayName: string;
};

export type ChatAgentConfig = {
  instructions: string;
  connections: Record<string, string>;
};

export type NamespaceChat = {
  uid: string;
  namespaceId: string;
  chatDisplayName: string;
  agentConfig: ChatAgentConfig;
  createTime: string;
  updateTime: Nullable<string>;
  deleteTime: Nullable<string>;
};

export type CreateNamespaceChatResponse = {
  chat: NamespaceChat;
};

export type PostNamespaceChatMessage = {
  message: string;
};

export enum NamespaceChatMessageType {
  Started = "CHAT_STARTED",
  StatusUpdated = "CHAT_STATUS_UPDATED",
  OutputUpdated = "CHAT_OUTPUT_UPDATED",
  Ended = "CHAT_ENDED",
}

export type NamespaceChatMessageData = {
  createTime: string;
  chatStatus?: string;
  outputChunkDelta?: string;
};

export type ListPaginatedNamespaceChatsRequest = {
  namespaceId: string;
  pageToken?: string;
  pageSize?: number;
};

export type ListPaginatedNamespaceChatsResponse = {
  chats: NamespaceChat[];
  nextPageToken: string;
  totalSize: number;
};

export type ListNamespaceChatsRequest = ListPaginatedNamespaceChatsRequest;

export type ListNamespaceChatsResponse = {
  chats: NamespaceChat[];
};

export type DeleteNamespaceChatRequest = {
  namespaceId: string;
  chatId: string;
};

export type PostNamespaceChatMessageRequest = {
  namespaceId: string;
  chatId: string;
  message: string;
  userUid: string;
};

export type PostNamespaceChatMessageResponse = ReadableStream;
