import { getInstillAdditionalHeaders, getQueryString } from "../helper";
import { APIResource } from "../main/resource";
import {
  CreateNamespaceChatRequest,
  CreateNamespaceChatResponse,
  DeleteNamespaceChatRequest,
  ListNamespaceChatsRequest,
  ListNamespaceChatsResponse,
  ListPaginatedNamespaceChatsRequest,
  ListPaginatedNamespaceChatsResponse,
  NamespaceChat,
  PostNamespaceChatMessageRequest,
  PostNamespaceChatMessageResponse,
} from "./types";

export class ChatClient extends APIResource {
  async createNamespaceChat(props: CreateNamespaceChatRequest) {
    const { namespaceId, ...payload } = props;

    try {
      const data = await this._client.post<CreateNamespaceChatResponse>(
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

  async listPaginatedNamespaceChats(props: ListPaginatedNamespaceChatsRequest) {
    const { namespaceId, pageToken, pageSize } = props;

    const queryString = getQueryString({
      baseURL: `/namespaces/${namespaceId}/chats`,
      pageToken,
      pageSize,
    });

    try {
      const data =
        await this._client.get<ListPaginatedNamespaceChatsResponse>(
          queryString,
        );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listNamespaceChats(props: ListNamespaceChatsRequest) {
    const { namespaceId, pageToken, pageSize } = props;

    const queryString = getQueryString({
      baseURL: `/namespaces/${namespaceId}/chats`,
      pageToken,
      pageSize,
    });

    const chats: NamespaceChat[] = [];

    try {
      const data =
        await this._client.get<ListPaginatedNamespaceChatsResponse>(
          queryString,
        );

      chats.push(...data.chats);

      if (data.nextPageToken) {
        chats.push(
          ...(
            await this.listNamespaceChats({
              namespaceId,
              pageSize,
              pageToken: data.nextPageToken,
            })
          ).chats,
        );
      }

      const response: ListNamespaceChatsResponse = {
        chats,
      };

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteNamespaceChat(props: DeleteNamespaceChatRequest) {
    const { namespaceId, chatId } = props;

    try {
      await this._client.delete(`/namespaces/${namespaceId}/chats/${chatId}`);

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async postNamespaceChatMessage({
    namespaceId,
    userUid,
    chatId,
    message,
  }: PostNamespaceChatMessageRequest) {
    const additionalHeaders = getInstillAdditionalHeaders({
      userUid,
      stream: true,
    });

    try {
      const stream = await this._client.post<PostNamespaceChatMessageResponse>(
        `/namespaces/${namespaceId}/chats/${chatId}/chat-with-agent`,
        {
          body: JSON.stringify({ message }),
          additionalHeaders,
        },
      );

      return Promise.resolve(stream);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
