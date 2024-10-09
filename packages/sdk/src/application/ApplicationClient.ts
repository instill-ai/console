import { getInstillAdditionalHeaders, getQueryString } from "../helper";
import { APIResource } from "../main/resource";
import {
  Application,
  Catalog,
  Conversation,
  CreateApplicationRequest,
  CreateApplicationResponse,
  DeleteApplicationRequest,
  GetApplicationRequest,
  GetApplicationResponse,
  ListApplicationsRequest,
  ListApplicationsResponse,
  Message,
  UpdateApplicationRequest,
  UpdateApplicationResponse,
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
  }: {
    ownerId: string;
    appId: string;
    payload: { conversationId: string };
  }) {
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
  }: {
    ownerId: string;
    appId: string;
  }) {
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

  async listMessages({
    ownerId,
    appId,
    conversationId,
  }: {
    ownerId: string;
    appId: string;
    conversationId: string;
  }) {
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
  }: {
    ownerId: string;
    appId: string;
  }) {
    try {
      const additionalHeaders = getInstillAdditionalHeaders({});
      const response = await this._client.post<Conversation>(
        `/namespaces/${ownerId}/apps/${appId}/ai_assistant_playground/restart`,
        { additionalHeaders },
      );
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateConversation({
    namespaceId,
    appId,
    conversationId,
    payload,
  }: {
    namespaceId: string;
    appId: string;
    conversationId: string;
    payload: {
      newConversationId: string;
      lastUsedCatalogUid: string | undefined;
      lastUsedTopK: number;
    };
  }) {
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

  async getCatalogs({ ownerId }: { ownerId: string }) {
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

  async getFileContent({
    ownerId,
    catalogId,
    fileUid,
  }: {
    ownerId: string;
    catalogId: string;
    fileUid: string;
  }) {
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
