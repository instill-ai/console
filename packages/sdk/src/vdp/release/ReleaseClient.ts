import { getQueryString } from "../../helper";
import { APIResource } from "../../main/resource";
import {
  CreateNamespacePipelineReleaseRequest,
  CreateNamespacePipelineReleaseResponse,
  DeleteNamespacePipelineReleaseRequest,
  GetNamespacePipelineReleaseRequest,
  GetNamespacePipelineReleaseResponse,
  ListNamespacePipelineReleaseRequest,
  ListNamespacePipelineReleaseResponse,
  PipelineRelease,
  RenameNamespacePipelineReleaseRequest,
  RenameNamespacePipelineReleaseResponse,
  SetPinnedNamespacePipelineReleaseRequest,
  UpdateNamespacePipelineReleaseRequest,
  UpdateNamespacePipelineReleaseResponse,
} from "./types";

export class ReleaseClient extends APIResource {
  /* ----------------------------------------------------------------------------
   * Query
   * ---------------------------------------------------------------------------*/

  async GetNamespacePipelineRelease({
    namespacePipelineReleaseName,
  }: GetNamespacePipelineReleaseRequest) {
    try {
      const data = await this._client.get<GetNamespacePipelineReleaseResponse>(
        `/${namespacePipelineReleaseName}`,
      );

      return Promise.resolve(data.release);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listNamespacePipelineReleases(
    props: ListNamespacePipelineReleaseRequest & {
      enablePagination: true;
    },
  ): Promise<ListNamespacePipelineReleaseResponse>;
  async listNamespacePipelineReleases(
    props: ListNamespacePipelineReleaseRequest & {
      enablePagination: false;
    },
  ): Promise<PipelineRelease[]>;
  async listNamespacePipelineReleases(
    props: ListNamespacePipelineReleaseRequest & {
      enablePagination: undefined;
    },
  ): Promise<PipelineRelease[]>;
  async listNamespacePipelineReleases(
    props: ListNamespacePipelineReleaseRequest & {
      enablePagination?: boolean;
    },
  ): Promise<ListNamespacePipelineReleaseResponse | PipelineRelease[]>;
  async listNamespacePipelineReleases(
    props: ListNamespacePipelineReleaseRequest & { enablePagination?: boolean },
  ) {
    const {
      namespacePipelineName,
      pageSize,
      pageToken,
      shareCode,
      view,
      filter,
      enablePagination,
    } = props;

    try {
      const releases: PipelineRelease[] = [];

      const queryString = getQueryString({
        baseURL: `/${namespacePipelineName}/releases`,
        pageSize,
        pageToken,
        view,
        filter,
      });

      const data = await this._client.get<ListNamespacePipelineReleaseResponse>(
        queryString,
        {
          additionalHeaders: {
            "instill-share-code": shareCode,
            "Access-Control-Allow-Headers": shareCode
              ? "instill-share-code"
              : undefined,
          },
        },
      );

      if (enablePagination) {
        return Promise.resolve(data);
      }

      releases.push(...data.releases);

      if (data.nextPageToken) {
        releases.push(
          ...(await this.listNamespacePipelineReleases({
            namespacePipelineName,
            pageSize,
            pageToken: data.nextPageToken,
            shareCode,
            view,
            filter,
            enablePagination: false,
          })),
        );
      }

      return Promise.resolve(releases);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /* ----------------------------------------------------------------------------
   * Mutation
   * ---------------------------------------------------------------------------*/

  async createNamespacePipelineRelease(
    props: CreateNamespacePipelineReleaseRequest,
  ) {
    const { namespacePipelineName, ...payload } = props;

    try {
      const data =
        await this._client.post<CreateNamespacePipelineReleaseResponse>(
          `/${namespacePipelineName}/releases`,
          {
            body: JSON.stringify(payload),
          },
        );

      return Promise.resolve(data.release);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteNamespacePipelineRelease({
    namespacePipelineReleaseName,
  }: DeleteNamespacePipelineReleaseRequest) {
    try {
      await this._client.delete(`/${namespacePipelineReleaseName}`);

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateNamespacePipelineRelease({
    namespacePipelineReleaseName,
    description,
  }: UpdateNamespacePipelineReleaseRequest) {
    try {
      const data =
        await this._client.patch<UpdateNamespacePipelineReleaseResponse>(
          `/${namespacePipelineReleaseName}`,
          {
            body: JSON.stringify({ description }),
          },
        );

      return Promise.resolve(data.release);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async setPinnedNamespacePipelineRelease({
    namespacePipelineReleaseName,
  }: SetPinnedNamespacePipelineReleaseRequest) {
    try {
      await this._client.post(`/${namespacePipelineReleaseName}/restore`);

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async renameNamespacePipelineRelease({
    namespacePipelineReleaseName,
    newPipelineReleaseId,
  }: RenameNamespacePipelineReleaseRequest) {
    try {
      const data =
        await this._client.post<RenameNamespacePipelineReleaseResponse>(
          `/${namespacePipelineReleaseName}/rename`,
          {
            body: JSON.stringify({ id: newPipelineReleaseId }),
          },
        );

      return Promise.resolve(data.release);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
