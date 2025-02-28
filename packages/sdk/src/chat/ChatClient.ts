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
    const { namespaceId, chatId } = props;

    try {
      await this._client.delete(`/namespaces/${namespaceId}/chats/${chatId}`);

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getInstillChat(props: GetInstillChatRequest) {
    const { namespaceId, chatId } = props;

    try {
      const response = await this._client.get<GetInstillChatResponse>(
        `/namespaces/${namespaceId}/chats/${chatId}`,
      );

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async postInstillChatMessage({
    namespaceId,
    chatId,
    message,
  }: PostInstillChatMessageRequest) {
    const additionalHeaders = getInstillAdditionalHeaders({
      stream: true,
    });

    try {
      const stream = await this._client.post<PostInstillChatMessageResponse>(
        `/namespaces/${namespaceId}/chats/${chatId}/chat-with-agent`,
        {
          body: JSON.stringify({ message }),
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
    const { namespaceId, chatId, pageToken, pageSize } = props;

    const queryString = getQueryString({
      baseURL: `/namespaces/${namespaceId}/chats/${chatId}/messages`,
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
    const { namespaceId, chatId, pageToken, pageSize } = props;

    const queryString = getQueryString({
      baseURL: `/namespaces/${namespaceId}/chats/${chatId}/messages`,
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
              chatId,
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
}
