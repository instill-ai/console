import { getInstillAdditionalHeaders, getQueryString } from "../helper";
import { APIResource } from "../main/resource";
import {
  Application,
  Catalog,
  ChatRequest,
  Conversation,
  CreateApplicationRequest,
  CreateApplicationResponse,
  CreateConversationRequest,
  DeleteApplicationRequest,
  GetApplicationRequest,
  GetApplicationResponse,
  GetCatalogsRequest,
  GetFileContentRequest,
  GetPlaygroundConversationRequest,
  ListApplicationsRequest,
  ListApplicationsResponse,
  ListMessagesRequest,
  Message,
  RestartPlaygroundConversationRequest,
  UpdateApplicationRequest,
  UpdateApplicationResponse,
  UpdateConversationRequest,
} from "./types";

export class ApplicationClient extends APIResource {
  /* ----------------------------------------------------------------------------
   * Query
   * ---------------------------------------------------------------------------*/

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
        pageSize: pageSize !== null ? pageSize : undefined,
        pageToken: pageToken !== null ? pageToken : undefined,
        view: view !== null ? view : undefined,
      });

      const additionalHeaders = getInstillAdditionalHeaders({});

      const data = await this._client.get<ListApplicationsResponse>(
        queryString,
        {
          additionalHeaders,
        },
      );

      if (enablePagination) {
        return Promise.resolve(data);
      }

      applications.push(...data.apps);

      if (data.nextPageToken) {
        applications.push(
          ...(await this.listApplications({
            pageSize,
            pageToken: data.nextPageToken,
            enablePagination,
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

  async getApplication({ applicationName }: GetApplicationRequest) {
    try {
      const additionalHeaders = getInstillAdditionalHeaders({});
      const data = await this._client.get<GetApplicationResponse>(
        `/${applicationName}`,
        { additionalHeaders },
      );

      return Promise.resolve(data.app);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async createConversation({
    ownerId,
    appId,
    payload,
  }: CreateConversationRequest) {
    try {
      const additionalHeaders = getInstillAdditionalHeaders({});
      const response = await this._client.post<Conversation>(
        `/namespaces/${ownerId}/apps/${appId}/conversations`,
        {
          body: JSON.stringify(payload),
          additionalHeaders,
        },
      );
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getPlaygroundConversation({
    ownerId,
    appId,
  }: GetPlaygroundConversationRequest) {
    try {
      const additionalHeaders = getInstillAdditionalHeaders({});
      const response = await this._client.get<{ conversation: Conversation }>(
        `/namespaces/${ownerId}/apps/${appId}/ai_assistant_playground/conversation`,
        { additionalHeaders },
      );
      return Promise.resolve(response.conversation);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async chat({
    ownerId,
    appId,
    catalogId,
    conversationUid,
    message,
    topK = 15,
    namespaceId,
  }: ChatRequest): Promise<Response> {
    try {
      const additionalHeaders = getInstillAdditionalHeaders({
        requesterUid: namespaceId,
      });
      const response = await this._client.post<Response>(
        `/namespaces/${ownerId}/apps/${appId}/chat`,
        {
          body: JSON.stringify({
            catalog_id: catalogId,
            conversation_uid: conversationUid,
            message: message,
            top_k: topK,
          }),
          additionalHeaders: {
            ...additionalHeaders,
            Accept: "text/event-stream",
          },
        },
      );
      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listMessages({ ownerId, appId, conversationId }: ListMessagesRequest) {
    try {
      const additionalHeaders = getInstillAdditionalHeaders({});
      const response = await this._client.get<{ messages: Message[] }>(
        `/namespaces/${ownerId}/apps/${appId}/conversations/${conversationId}/messages?ifAll=true`,
        { additionalHeaders },
      );
      return Promise.resolve(response.messages);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async restartPlaygroundConversation({
    ownerId,
    appId,
  }: RestartPlaygroundConversationRequest): Promise<Conversation> {
    try {
      const additionalHeaders = getInstillAdditionalHeaders({});
      const response = await this._client.post<Conversation>(
        `/namespaces/${ownerId}/apps/${appId}/ai_assistant_playground/restart`,
        {
          additionalHeaders,
        },
      );
      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateConversation({
    namespaceId,
    appId,
    conversationId,
    payload,
  }: UpdateConversationRequest) {
    try {
      const additionalHeaders = getInstillAdditionalHeaders({});
      const response = await this._client.put<Conversation>(
        `/namespaces/${namespaceId}/apps/${appId}/conversations/${conversationId}`,
        {
          body: JSON.stringify(payload),
          additionalHeaders,
        },
      );
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getCatalogs({ ownerId }: GetCatalogsRequest) {
    try {
      const additionalHeaders = getInstillAdditionalHeaders({});
      const response = await this._client.get<{ catalogs: Catalog[] }>(
        `/namespaces/${ownerId}/catalogs`,
        { additionalHeaders },
      );
      return Promise.resolve(response.catalogs || []);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getFileContent({ ownerId, catalogId, fileUid }: GetFileContentRequest) {
    try {
      const additionalHeaders = getInstillAdditionalHeaders({});
      const response = await this._client.get<{
        sourceFile: { content: string };
      }>(
        `/namespaces/${ownerId}/catalogs/${catalogId}/files/${fileUid}/source`,
        { additionalHeaders },
      );
      return Promise.resolve(response.sourceFile.content);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /* ----------------------------------------------------------------------------
   * Mutation
   * ---------------------------------------------------------------------------*/

  async createApplication(props: CreateApplicationRequest) {
    const { ownerId, ...payload } = props;

    try {
      const additionalHeaders = getInstillAdditionalHeaders({});
      const data = await this._client.post<CreateApplicationResponse>(
        `/namespaces/${ownerId}/apps`,
        {
          body: JSON.stringify(payload),
          additionalHeaders,
        },
      );

      return Promise.resolve(data.app);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateApplication(props: UpdateApplicationRequest) {
    const { ownerId, appId, ...payload } = props;

    try {
      const additionalHeaders = getInstillAdditionalHeaders({});
      const data = await this._client.put<UpdateApplicationResponse>(
        `/namespaces/${ownerId}/apps/${appId}`,
        {
          body: JSON.stringify(payload),
          additionalHeaders,
        },
      );

      return Promise.resolve(data.app);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteApplication({ ownerId, appId }: DeleteApplicationRequest) {
    try {
      const additionalHeaders = getInstillAdditionalHeaders({});
      await this._client.delete(`/namespaces/${ownerId}/apps/${appId}`, {
        additionalHeaders,
      });
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
