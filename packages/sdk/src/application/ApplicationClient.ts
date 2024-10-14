import { getInstillAdditionalHeaders, getQueryString } from "../helper";
import { APIResource } from "../main/resource";
import {
  Application,
  ChatRequest,
  Conversation,
  CreateApplicationRequest,
  CreateApplicationResponse,
  CreateConversationRequest,
  CreateConversationResponse,
  CreateMessageRequest,
  CreateMessageResponse,
  DeleteApplicationRequest,
  DeleteConversationRequest,
  DeleteMessageRequest,
  GetApplicationRequest,
  GetApplicationResponse,
  GetPlaygroundConversationRequest,
  GetPlaygroundConversationResponse,
  ListApplicationsRequest,
  ListApplicationsResponse,
  ListConversationsRequest,
  ListConversationsResponse,
  ListMessagesRequest,
  ListMessagesResponse,
  Message,
  RestartPlaygroundConversationRequest,
  RestartPlaygroundConversationResponse,
  UpdateApplicationRequest,
  UpdateApplicationResponse,
  UpdateConversationRequest,
  UpdateConversationResponse,
  UpdateMessageRequest,
  UpdateMessageResponse,
} from "./types";

export class ApplicationClient extends APIResource {
  async listApplications(
    props: ListApplicationsRequest & {
      enablePagination: true;
    },
  ): Promise<ListApplicationsResponse>;
  async listApplications(
    props: ListApplicationsRequest & {
      enablePagination: false;
    },
  ): Promise<Application[]>;
  async listApplications(
    props: ListApplicationsRequest & {
      enablePagination: boolean;
    },
  ): Promise<ListApplicationsResponse | Application[]>;
  async listApplications(
    props: ListApplicationsRequest & {
      enablePagination: boolean;
    },
  ) {
    const { pageSize, pageToken, view, enablePagination, ownerId } = props;

    try {
      const applications: Application[] = [];

      const queryString = getQueryString({
        baseURL: `/namespaces/${ownerId}/apps`,
        pageSize,
        pageToken,
        view,
      });

      const data =
        await this._client.get<ListApplicationsResponse>(queryString);

      if (enablePagination) {
        return Promise.resolve(data);
      }

      applications.push(...data.apps);

      if (data.nextPageToken) {
        applications.push(
          ...(await this.listApplications({
            pageSize,
            pageToken: data.nextPageToken,
            enablePagination: false,
            view,
            ownerId,
          })),
        );
      }

      return Promise.resolve(applications);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getApplication({
    applicationName,
  }: GetApplicationRequest): Promise<Application> {
    try {
      const queryString = getQueryString({
        baseURL: `/${applicationName}`,
      });

      const data = await this._client.get<GetApplicationResponse>(queryString);

      return Promise.resolve(data.app);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async createApplication(
    props: CreateApplicationRequest,
  ): Promise<Application> {
    const { ownerId, ...payload } = props;

    try {
      const queryString = getQueryString({
        baseURL: `/namespaces/${ownerId}/apps`,
      });

      const data = await this._client.post<CreateApplicationResponse>(
        queryString,
        {
          body: JSON.stringify(payload),
        },
      );

      return Promise.resolve(data.app);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateApplication(
    props: UpdateApplicationRequest,
  ): Promise<Application> {
    const { ownerId, appId, ...payload } = props;

    try {
      const queryString = getQueryString({
        baseURL: `/namespaces/${ownerId}/apps/${appId}`,
      });

      const data = await this._client.put<UpdateApplicationResponse>(
        queryString,
        {
          body: JSON.stringify(payload),
        },
      );

      return Promise.resolve(data.app);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteApplication({
    ownerId,
    appId,
  }: DeleteApplicationRequest): Promise<void> {
    try {
      const queryString = getQueryString({
        baseURL: `/namespaces/${ownerId}/apps/${appId}`,
      });

      await this._client.delete(queryString);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listConversations(
    props: ListConversationsRequest & {
      enablePagination: true;
    },
  ): Promise<ListConversationsResponse>;
  async listConversations(
    props: ListConversationsRequest & {
      enablePagination: false;
    },
  ): Promise<Conversation[]>;
  async listConversations(
    props: ListConversationsRequest & {
      enablePagination: boolean;
    },
  ): Promise<ListConversationsResponse | Conversation[]>;
  async listConversations(
    props: ListConversationsRequest & {
      enablePagination: boolean;
    },
  ) {
    const { ownerId, appId, pageSize, pageToken, enablePagination } = props;

    try {
      const conversations: Conversation[] = [];

      const queryString = getQueryString({
        baseURL: `/namespaces/${ownerId}/apps/${appId}/conversations`,
        pageSize,
        pageToken,
      });

      const data =
        await this._client.get<ListConversationsResponse>(queryString);

      if (enablePagination) {
        return Promise.resolve(data);
      }

      conversations.push(...data.conversations);

      if (data.nextPageToken) {
        conversations.push(
          ...(await this.listConversations({
            ownerId,
            appId,
            pageSize,
            pageToken: data.nextPageToken,
            enablePagination: false,
          })),
        );
      }

      return Promise.resolve(conversations);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async createConversation(
    props: CreateConversationRequest,
  ): Promise<CreateConversationResponse> {
    const { ownerId, appId, payload } = props;

    try {
      const queryString = getQueryString({
        baseURL: `/namespaces/${ownerId}/apps/${appId}/conversations`,
      });

      const response = await this._client.post<CreateConversationResponse>(
        queryString,
        {
          body: JSON.stringify(payload),
        },
      );
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateConversation(
    props: UpdateConversationRequest,
  ): Promise<UpdateConversationResponse> {
    const { namespaceId, appId, conversationId, payload } = props;

    try {
      const queryString = getQueryString({
        baseURL: `/namespaces/${namespaceId}/apps/${appId}/conversations/${conversationId}`,
      });

      const response = await this._client.put<UpdateConversationResponse>(
        queryString,
        {
          body: JSON.stringify(payload),
        },
      );
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteConversation(props: DeleteConversationRequest): Promise<void> {
    const { ownerId, appId, conversationId } = props;

    try {
      const queryString = getQueryString({
        baseURL: `/namespaces/${ownerId}/apps/${appId}/conversations/${conversationId}`,
      });

      await this._client.delete(queryString);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listMessages(
    props: ListMessagesRequest & {
      enablePagination: true;
    },
  ): Promise<ListMessagesResponse>;
  async listMessages(
    props: ListMessagesRequest & {
      enablePagination: false;
    },
  ): Promise<Message[]>;
  async listMessages(
    props: ListMessagesRequest & {
      enablePagination: boolean;
    },
  ): Promise<ListMessagesResponse | Message[]>;
  async listMessages(
    props: ListMessagesRequest & {
      enablePagination: boolean;
    },
  ) {
    const { ownerId, appId, conversationId, enablePagination, pageSize } =
      props;

    try {
      const messages: Message[] = [];

      const queryString = getQueryString({
        baseURL: `/namespaces/${ownerId}/apps/${appId}/conversations/${conversationId}/messages`,
      });

      const data = await this._client.get<ListMessagesResponse>(queryString);

      if (enablePagination) {
        return Promise.resolve(data);
      }

      messages.push(...data.messages);

      if (data.nextPageToken) {
        messages.push(
          ...(await this.listMessages({
            pageSize,
            pageToken: data.nextPageToken,
            ownerId,
            appId,
            conversationId,
            enablePagination: false,
          })),
        );
      }

      return Promise.resolve(messages);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async createMessage(
    props: CreateMessageRequest,
  ): Promise<CreateMessageResponse> {
    const { ownerId, appId, conversationId, ...payload } = props;

    try {
      const queryString = getQueryString({
        baseURL: `/namespaces/${ownerId}/apps/${appId}/conversations/${conversationId}/messages`,
      });

      const response = await this._client.post<CreateMessageResponse>(
        queryString,
        {
          body: JSON.stringify(payload),
        },
      );
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateMessage(
    props: UpdateMessageRequest,
  ): Promise<UpdateMessageResponse> {
    const { ownerId, appId, conversationId, messageUid, ...payload } = props;

    try {
      const queryString = getQueryString({
        baseURL: `/namespaces/${ownerId}/apps/${appId}/conversations/${conversationId}/messages/${messageUid}`,
      });

      const response = await this._client.put<UpdateMessageResponse>(
        queryString,
        {
          body: JSON.stringify(payload),
        },
      );
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteMessage(props: DeleteMessageRequest): Promise<void> {
    const { ownerId, appId, conversationId, messageUid } = props;

    try {
      const queryString = getQueryString({
        baseURL: `/namespaces/${ownerId}/apps/${appId}/conversations/${conversationId}/messages/${messageUid}`,
      });

      await this._client.delete(queryString);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getPlaygroundConversation(
    props: GetPlaygroundConversationRequest,
  ): Promise<GetPlaygroundConversationResponse> {
    const { ownerId, appId } = props;

    try {
      const queryString = getQueryString({
        baseURL: `/namespaces/${ownerId}/apps/${appId}/ai_assistant_playground/conversation`,
      });

      const response =
        await this._client.get<GetPlaygroundConversationResponse>(queryString);
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async restartPlaygroundConversation(
    props: RestartPlaygroundConversationRequest,
  ): Promise<RestartPlaygroundConversationResponse> {
    const { ownerId, appId } = props;

    try {
      const queryString = getQueryString({
        baseURL: `/namespaces/${ownerId}/apps/${appId}/ai_assistant_playground/restart`,
      });

      const response =
        await this._client.post<RestartPlaygroundConversationResponse>(
          queryString,
        );
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async chat(props: ChatRequest): Promise<Response> {
    const { ownerId, appId, requesterUid, ...payload } = props;

    try {
      const queryString = getQueryString({
        baseURL: `/namespaces/${ownerId}/apps/${appId}/chat`,
      });

      const additionalHeaders = getInstillAdditionalHeaders({
        stream: true,
        requesterUid: requesterUid,
      });

      const response = await fetch(queryString, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...additionalHeaders,
          Accept: "text/event-stream",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`,
        );
      }

      const contentType = response.headers.get("Content-Type");
      if (contentType !== "text/event-stream") {
        throw new Error(`Unexpected Content-Type: ${contentType}`);
      }

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
