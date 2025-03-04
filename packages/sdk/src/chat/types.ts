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

export const InstillChatTypeEnum = {
  Started: "CHAT_STARTED",
  StatusUpdated: "CHAT_STATUS_UPDATED",
  OutputUpdated: "CHAT_OUTPUT_UPDATED",
  Ended: "CHAT_ENDED",
  NameUpdated: "CHAT_NAME_UPDATED",
  DebugOutputUpdated: "CHAT_DEBUG_OUTPUT_UPDATED",
  ReplanTriggered: "CHAT_REPLAN_TRIGGERED",
  ErrorUpdated: "CHAT_ERROR_UPDATED",
} as const;

export type InstillChatEventType =
  (typeof InstillChatTypeEnum)[keyof typeof InstillChatTypeEnum];

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

export type InstillChatEventStatus = {
  event: typeof InstillChatTypeEnum.StatusUpdated;
  data: InstillChatEventCommonData & {
    chatStatus: string;
  };
};

export type InstillChatEventOutput = {
  event: typeof InstillChatTypeEnum.OutputUpdated;
  data: InstillChatEventCommonData & {
    outputChunkDelta: string;
  };
};

export type InstillChatEventName = {
  event: typeof InstillChatTypeEnum.NameUpdated;
  data: InstillChatEventCommonData & {
    name: string;
  };
};

export type InstillChatEventDebug = {
  event: typeof InstillChatTypeEnum.DebugOutputUpdated;
  data: InstillChatEventCommonData & {
    debugOutput: string;
  };
};

export type InstillChatEventReplan = {
  event: typeof InstillChatTypeEnum.ReplanTriggered;
  data: InstillChatEventCommonData & {
    numberOfReplan: number;
  };
};

export type InstillChatEventError = {
  event: typeof InstillChatTypeEnum.ErrorUpdated;
  data: InstillChatEventCommonData & {
    errorType: InstillChatErrorType;
    error: string;
  };
};

export type InstillChatEventStart = {
  event: typeof InstillChatTypeEnum.Started;
  data: InstillChatEventCommonData;
};

export type InstillChatEventEnd = {
  event: typeof InstillChatTypeEnum.Ended;
  data: InstillChatEventCommonData;
};

export type InstillChatEvent =
  | InstillChatEventStatus
  | InstillChatEventOutput
  | InstillChatEventName
  | InstillChatEventDebug
  | InstillChatEventReplan
  | InstillChatEventError
  | InstillChatEventStart
  | InstillChatEventEnd;

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
