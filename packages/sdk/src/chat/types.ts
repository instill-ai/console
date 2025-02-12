import { Nullable } from "../types";
import { instillChatMessageEnum } from "./constant";

export type CreateInstillChatRequest = {
  namespaceId: string;
  chatDisplayName: string;
};

export type ChatAgentConfig = {
  instructions: string;
  connections: Record<string, string>;
};

export type InstillChat = {
  uid: string;
  namespaceId: string;
  chatDisplayName: string;
  agentConfig: ChatAgentConfig;
  createTime: string;
  updateTime: Nullable<string>;
  deleteTime: Nullable<string>;
};

export type CreateInstillChatResponse = {
  chat: InstillChat;
};

export type PostInstillChatMessage = {
  message: string;
};

export type InstillChatMessageType =
  (typeof instillChatMessageEnum)[keyof typeof instillChatMessageEnum];

export type InstillChatMessageData = {
  createTime: string;
  chatStatus?: string;
  outputChunkDelta?: string;
};

export type ListPaginatedInstillChatsRequest = {
  namespaceId: string;
  pageToken?: string;
  pageSize?: number;
};

export type ListPaginatedInstillChatsResponse = {
  chats: InstillChat[];
  nextPageToken: string;
  totalSize: number;
};

export type ListInstillChatsRequest = ListPaginatedInstillChatsRequest;

export type ListInstillChatsResponse = {
  chats: InstillChat[];
};

export type DeleteInstillChatRequest = {
  namespaceId: string;
  chatId: string;
};

export type PostInstillChatMessageRequest = {
  namespaceId: string;
  chatId: string;
  message: string;
  userUid: string;
};

export type PostInstillChatMessageResponse = ReadableStream;
