import { Nullable } from "../types";

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
  catalogId: string;
};

export type CreateInstillChatResponse = {
  chat: InstillChat;
};

export type GetInstillChatResponse = CreateInstillChatResponse;

export type PostInstillChatMessage = {
  message: string;
};

enum InstillChatTypeEnum {
  Started = "CHAT_STARTED",
  StatusUpdated = "CHAT_STATUS_UPDATED",
  OutputUpdated = "CHAT_OUTPUT_UPDATED",
  Ended = "CHAT_ENDED",
  UserMessage = "CHAT_USER_MESSAGE",
}

export type InstillChatType = `${InstillChatTypeEnum}`;

export type InstillChatMessageData = {
  createTime: string;
  chatStatus?: string;
  outputChunkDelta?: string;
};

export type InstillChatEvent = {
  event: `${InstillChatTypeEnum}`;
  data: InstillChatMessageData;
};

export type InstillChatFeed = InstillChatMessage[];

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

export type GetInstillChatRequest = DeleteInstillChatRequest;

export type PostInstillChatMessageRequest = {
  namespaceId: string;
  chatId: string;
  message: string;
};

export type PostInstillChatMessageResponse = {
  body: ReadableStream;
};

export type ListPaginatedInstillChatMessagesRequest = {
  namespaceId: string;
  chatId: string;
  pageToken?: string;
  pageSize?: number;
};

export type ListPaginatedInstillChatMessagesResponse = {
  messages: InstillChatMessage[];
  nextPageToken: string;
  totalSize: number;
};

export type ListInstillChatMessagesRequest =
  ListPaginatedInstillChatMessagesRequest;

export type ListInstillChatMessagesResponse = {
  messages: InstillChatMessage[];
};

export type InstillChatMessageCitation = string;

export type InstillChatMessageRole = "user" | "assistant";

enum InstillChatMessageTypeEnum {
  Text = "MESSAGE_TYPE_TEXT",
}

export type InstillChatMessageType = `${InstillChatMessageTypeEnum}`;

export type InstillChatMessage = {
  uid: string;
  chatUid: string;
  content: string;
  role: InstillChatMessageRole;
  type: InstillChatMessageType;
  createTime: string;
  updateTime: string;
  msgSenderUid: string;
  citations: InstillChatMessageCitation[];
};
