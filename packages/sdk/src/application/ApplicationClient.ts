import { getInstillAdditionalHeaders, getQueryString } from "../helper";
import { APIResource } from "../main/resource";
import {
  Application,
  CreateApplicationRequest,
  CreateApplicationResponse,
  DeleteApplicationRequest,
  GetApplicationRequest,
  GetApplicationResponse,
  ListApplicationsRequest,
  ListApplicationsResponse,
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
