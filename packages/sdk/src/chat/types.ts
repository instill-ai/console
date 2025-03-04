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
  NameUpdated = "CHAT_NAME_UPDATED",
  DebugOutputUpdated = "CHAT_DEBUG_OUTPUT_UPDATED",
  ReplanTriggered = "CHAT_REPLAN_TRIGGERED",
  ErrorUpdated = "CHAT_ERROR_UPDATED",
}

export type InstillChatType = `${InstillChatTypeEnum}`;

enum InstillChatErrorTypeEnum {
  Unknown = "UnknownError",
  Internal = "InternalError",
  ReplanLimit = "ReplanLimitError",
  CreditInsufficient = "CreditInsufficientError",
  RefusalLLM = "RefusalLLMError",
  InvalidLLM = "InvalidLLMError",
  UnavailableLLM = "UnavailableLLMError",
}

export type InstillChatErrorType = `${InstillChatErrorTypeEnum}`;

export type InstillChatEventCommonData = {
  createTime: string;
};

export type InstillChatEventStatusData = InstillChatEventCommonData & {
  chatStatus: string;
};

export type InstillChatEventOutputData = InstillChatEventCommonData & {
  outputChunkDelta: string;
};

export type InstillChatEventNameData = InstillChatEventCommonData & {
  name: string;
};

export type InstillChatEventDebugData = InstillChatEventCommonData & {
  debugOutput: string;
};

export type InstillChatEventReplanData = InstillChatEventCommonData & {
  numberOfReplan: number;
};

export type InstillChatEventErrorData = InstillChatEventCommonData & {
  errorType: InstillChatErrorType;
  error: string;
};

export type InstillChatEvent =
  | {
      event: InstillChatTypeEnum.Started | InstillChatTypeEnum.Ended;
      data: InstillChatEventCommonData;
    }
  | {
      event: InstillChatTypeEnum.StatusUpdated;
      data: InstillChatEventStatusData;
    }
  | {
      event: InstillChatTypeEnum.OutputUpdated;
      data: InstillChatEventOutputData;
    }
  | {
      event: InstillChatTypeEnum.NameUpdated;
      data: InstillChatEventNameData;
    }
  | {
      event: InstillChatTypeEnum.DebugOutputUpdated;
      data: InstillChatEventDebugData;
    }
  | {
      event: InstillChatTypeEnum.ReplanTriggered;
      data: InstillChatEventReplanData;
    }
  | {
      event: InstillChatTypeEnum.ErrorUpdated;
      data: InstillChatEventErrorData;
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
