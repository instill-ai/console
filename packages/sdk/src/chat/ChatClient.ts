import { getInstillAdditionalHeaders, getQueryString } from "../helper";
import { APIResource } from "../main/resource";
import {
  CreateInstillChatRequest,
  CreateInstillChatResponse,
  DeleteInstillChatRequest,
  ListInstillChatsRequest,
  ListInstillChatsResponse,
  ListPaginatedInstillChatsRequest,
  ListPaginatedInstillChatsResponse,
  InstillChat,
  PostInstillChatMessageRequest,
  PostInstillChatMessageResponse,
  ListPaginatedInstillChatMessagesRequest,
  ListPaginatedInstillChatMessagesResponse,
  ListInstillChatMessagesRequest,
  InstillChatMessage,
  ListInstillChatMessagesResponse,
  GetInstillChatRequest,
  GetInstillChatResponse,
  ListNamespaceChatTablesRequest,
  ListNamespaceChatTablesResponse,
  UpdateInstillChatRequest,
} from "./types";

export class ChatClient extends APIResource {
  async createInstillChat(props: CreateInstillChatRequest) {
    const { namespaceId, ...payload } = props;

    try {
      const data = await this._client.post<CreateInstillChatResponse>(
        `/namespaces/${namespaceId}/chats`,
        {
          body: JSON.stringify(payload),
        },
      );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateInstillChat(props: UpdateInstillChatRequest) {
    const { namespaceId, chatUid, ...body } = props;

    try {
      const data = await this._client.put<CreateInstillChatResponse>(
        `/namespaces/${namespaceId}/chats/${chatUid}`,
        {
          body: JSON.stringify(body),
        },
      );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listPaginatedInstillChats(props: ListPaginatedInstillChatsRequest) {
    const { namespaceId, pageToken, pageSize } = props;

    const queryString = getQueryString({
      baseURL: `/namespaces/${namespaceId}/chats`,
      pageToken,
      pageSize,
    });

    try {
      const data =
        await this._client.get<ListPaginatedInstillChatsResponse>(queryString);

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listInstillChats(props: ListInstillChatsRequest) {
    const { namespaceId, pageToken, pageSize } = props;

    const queryString = getQueryString({
      baseURL: `/namespaces/${namespaceId}/chats`,
      pageToken,
      pageSize,
    });

    const chats: InstillChat[] = [];

    try {
      const data =
        await this._client.get<ListPaginatedInstillChatsResponse>(queryString);

      chats.push(...data.chats);

      if (data.nextPageToken) {
        chats.push(
          ...(
            await this.listInstillChats({
              namespaceId,
              pageSize,
              pageToken: data.nextPageToken,
            })
          ).chats,
        );
      }

      const response: ListInstillChatsResponse = {
        chats,
      };

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteInstillChat(props: DeleteInstillChatRequest) {
    const { namespaceId, chatUid } = props;

    try {
      await this._client.delete(`/namespaces/${namespaceId}/chats/${chatUid}`);

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getInstillChat(props: GetInstillChatRequest) {
    const { namespaceId, chatUid } = props;

    try {
      const response = await this._client.get<GetInstillChatResponse>(
        `/namespaces/${namespaceId}/chats/${chatUid}`,
      );

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async postInstillChatMessage({
    namespaceId,
    chatUid,
    message,
    fileUids,
    enableWebSearch = false,
  }: PostInstillChatMessageRequest) {
    const additionalHeaders = getInstillAdditionalHeaders({
      stream: true,
    });

    try {
      const stream = await this._client.post<PostInstillChatMessageResponse>(
        `/namespaces/${namespaceId}/chats/${chatUid}/chat-with-agent`,
        {
          body: JSON.stringify({ message, fileUids, enableWebSearch }),
          additionalHeaders,
          stream: true,
        },
      );

      return Promise.resolve(stream);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listPaginatedInstillChatMessages(
    props: ListPaginatedInstillChatMessagesRequest,
  ) {
    const { namespaceId, chatUid, pageToken, pageSize } = props;

    const queryString = getQueryString({
      baseURL: `/namespaces/${namespaceId}/chats/${chatUid}/messages`,
      pageToken,
      pageSize,
    });

    try {
      const data =
        await this._client.get<ListPaginatedInstillChatMessagesResponse>(
          queryString,
        );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listInstillChatMessages(props: ListInstillChatMessagesRequest) {
    const { namespaceId, chatUid, pageToken, pageSize } = props;

    const queryString = getQueryString({
      baseURL: `/namespaces/${namespaceId}/chats/${chatUid}/messages`,
      pageToken,
      pageSize,
    });

    const messages: InstillChatMessage[] = [];

    try {
      const data =
        await this._client.get<ListPaginatedInstillChatMessagesResponse>(
          queryString,
        );

      messages.push(...data.messages);

      if (data.nextPageToken) {
        messages.push(
          ...(
            await this.listInstillChatMessages({
              namespaceId,
              chatUid,
              pageSize,
              pageToken: data.nextPageToken,
            })
          ).messages,
        );
      }

      const response: ListInstillChatMessagesResponse = {
        messages,
      };

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listNamespaceChatTables(props: ListNamespaceChatTablesRequest) {
    const { namespaceId, chatUid } = props;

    try {
      const data = await this._client.get<ListNamespaceChatTablesResponse>(
        `/namespaces/${namespaceId}/chats/${chatUid}/tables`,
      );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
