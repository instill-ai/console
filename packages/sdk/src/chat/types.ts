import { FileType } from "../catalog";
import { Table } from "../table";
import {
  Citation,
  InstillChatMessageContext,
  InstillChatMessageContextCatalog,
  InstillChatMessageContextFolder,
  InstillChatMessageContextTable,
  Nullable,
} from "../types";

export type ChatAgentConfig = {
  instructions: string;
  connections: Record<string, string>;
};

export type CreateInstillChatRequest = {
  namespaceId: string;
  chatDisplayName?: string;
  agentConfig?: ChatAgentConfig;
  catalogId?: string;
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

export type UpdateInstillChatRequest = {
  namespaceId: string;
  chatUid: string;
  chatDisplayName?: string;
  agentConfig?: ChatAgentConfig;
};

export type UpdateInstillChatResponse = {
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
  CitationListUpdated: "CHAT_CITATION_LIST_UPDATED",
  ChatAttachmentsUpdated: "CHAT_ATTACHMENTS_UPDATED",
  TableCreated: "CHAT_TABLE_CREATED",
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

export type InstillChatEventAttachments = {
  event: typeof InstillChatTypeEnum.ChatAttachmentsUpdated;
  data: InstillChatEventCommonData & {
    attachments: {
      fileAttachments: InstillChatMessageFileAttachment[];
    };
  };
};

export type InstillChatEventTableCreated = {
  event: typeof InstillChatTypeEnum.TableCreated;
  data: InstillChatEventCommonData & {
    tableUID: string;
  };
};

export type InstillChatEventCitationList = {
  event: typeof InstillChatTypeEnum.CitationListUpdated;
  data: InstillChatEventCommonData & {
    citations: Citation[];
  };
};

export type InstillChatEvent =
  | InstillChatEventStatus
  | InstillChatEventOutput
  | InstillChatEventName
  | InstillChatEventDebug
  | InstillChatEventReplan
  | InstillChatEventError
  | InstillChatEventStart
  | InstillChatEventEnd
  | InstillChatEventCitationList
  | InstillChatEventTableCreated
  | InstillChatEventAttachments;
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
  chatUid: string;
};

export type GetInstillChatRequest = DeleteInstillChatRequest;

export type PostInstillChatMessageRequest = {
  namespaceId: string;
  chatUid: string;
  message: string;
  objectUids?: string[];
  enableWebSearch?: boolean;
  tableUids: InstillChatMessageContextTable[];
  folders: InstillChatMessageContextFolder[];
  catalogs: InstillChatMessageContextCatalog[];
};

export type PostCreateTableFlowChatMessageRequest = {
  namespaceId: string;
  tableUid: string;
  message: string;
};

export type PostInstillChatMessageResponse = {
  body: ReadableStream;
};

export type PostCreateTableFlowChatMessageResponse = {
  body: ReadableStream;
};

export type ListPaginatedInstillChatMessagesRequest = {
  namespaceId: string;
  chatUid: string;
  pageToken?: string;
  pageSize?: number;
};

export type ListPaginatedCreateTableFlowChatMessagesRequest = {
  namespaceId: string;
  tableUid: string;
  pageToken?: string;
  pageSize?: number;
};

export type ListPaginatedInstillChatMessagesResponse = {
  messages: InstillChatMessage[];
  nextPageToken: string;
  totalSize: number;
};

export type ListPaginatedCreateTableFlowChatMessagesResponse = {
  messages: InstillChatMessage[];
  nextPageToken: string;
  totalSize: number;
};

export type ListInstillChatMessagesRequest =
  ListPaginatedInstillChatMessagesRequest;

export type ListCreateTableFlowChatMessagesRequest =
  ListPaginatedCreateTableFlowChatMessagesRequest;

export type ListInstillChatMessagesResponse = {
  messages: InstillChatMessage[];
};

export type ListCreateTableFlowChatMessagesResponse = {
  messages: InstillChatMessage[];
};

export type InstillChatMessageRole = "user" | "assistant";

enum InstillChatMessageTypeEnum {
  Text = "MESSAGE_TYPE_TEXT",
  ShowTable = "MESSAGE_TYPE_SHOW_TABLE",
}

export type InstillChatMessageType = `${InstillChatMessageTypeEnum}`;

export type InstillChatMessageFileAttachment = {
  fileName: string;
  fileSize: string;
  contentType: string;
  fileExtension: FileType;
  downloadUrl: string;
};

export type InstillChatMessage = {
  uid: string;
  chatUid: string;
  content: string;
  role: InstillChatMessageRole;
  type: InstillChatMessageType;
  createTime: string;
  updateTime: string;
  msgSenderUid: string;
  citations: Citation[];
  context: InstillChatMessageContext;
  attachments: {
    fileAttachments: InstillChatMessageFileAttachment[];
  };
};

export type ListNamespaceChatTablesRequest = {
  namespaceId: string;
  chatUid: string;
};

export type ListNamespaceChatTablesResponse = {
  tables: Table[];
};

export type ListNamespaceChatAvailableContextsRequest = {
  namespaceId: string;
};

export type NamespaceChatAvailableContextsFileOption = {
  fileUid: string;
  name: string;
  type: FileType;
  summary: string;
};

export type NamespaceChatAvailableContextsOption = {
  description: string;
  fileOptions: NamespaceChatAvailableContextsFileOption[];
};

export type NamespaceChatAvailableContextsFolderOption =
  NamespaceChatAvailableContextsOption & {
    folderUid: string;
    name: string;
  };

export type NamespaceChatAvailableContextsTableOption =
  NamespaceChatAvailableContextsOption & {
    tableUid: string;
    title: string;
  };

export type NamespaceChatAvailableContextsCatalogOption =
  NamespaceChatAvailableContextsOption & {
    catalogUid: string;
    catalogId: string;
  };

export type ListNamespaceChatAvailableContextsResponse = {
  folderOptions: NamespaceChatAvailableContextsFolderOption[];
  tableOptions: NamespaceChatAvailableContextsTableOption[];
  catalogOptions: NamespaceChatAvailableContextsCatalogOption[];
};
