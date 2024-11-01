import type {
  AskNamespaceCatalogQuestionRequest,
  AskNamespaceCatalogQuestionResponse,
  CreateNamespaceCatalogFileRequest,
  CreateNamespaceCatalogFileResponse,
  CreateNamespaceCatalogRequest,
  CreateNamespaceCatalogResponse,
  DeleteCatalogFileRequest,
  DeleteNamespaceCatalogRequest,
  GetNamespaceCatalogSingleSourceOfTruthFileRequest,
  GetNamespaceCatalogSingleSourceOfTruthFileResponse,
  ListCatalogsResponse,
  ListNamespaceCatalogChunksRequest,
  ListNamespaceCatalogChunksResponse,
  ListNamespaceCatalogFilesRequest,
  ListNamespaceCatalogFilesResponse,
  ListNamespaceCatalogRunsRequest,
  ListNamespaceCatalogRunsResponse,
  ListNamespaceCatalogsRequest,
  ListPaginatedNamespaceCatalogFilesRequest,
  ListPaginatedNamespaceCatalogFilesResponse,
  ListPaginatedNamespaceCatalogRunsRequest,
  ListPaginatedNamespaceCatalogRunsResponse,
  ProcessCatalogFilesRequest,
  ProcessCatalogFilesResponse,
  RetrieveSimilarNamespaceCatalogChunksRequest,
  RetrieveSimilarNamespaceCatalogChunksResponse,
  UpdateCatalogChunkRequest,
  UpdateCatalogChunkResponse,
  UpdateNamespaceCatalogRequest,
  UpdateNamespaceCatalogResponse,
} from "./types";
import { getInstillAdditionalHeaders, getQueryString } from "../helper";
import { APIResource } from "../main/resource";

export class CatalogClient extends APIResource {
  /* ----------------------------------------------------------------------------
   * Catalog
   * ---------------------------------------------------------------------------*/

  // This is a non paginated endpoint
  async listNamespaceCatalogs({ namespaceId }: ListNamespaceCatalogsRequest) {
    try {
      const queryString = getQueryString({
        baseURL: `/namespaces/${namespaceId}/catalogs`,
      });

      const data = await this._client.get<ListCatalogsResponse>(queryString);

      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async createNamespaceCatalog(props: CreateNamespaceCatalogRequest) {
    const { namespaceId, ...payload } = props;

    try {
      const queryString = getQueryString({
        baseURL: `/namespaces/${namespaceId}/catalogs`,
      });

      const data = await this._client.post<CreateNamespaceCatalogResponse>(
        queryString,
        {
          body: JSON.stringify(payload),
        },
      );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateNamespaceCatalog(props: UpdateNamespaceCatalogRequest) {
    const { namespaceId, catalogId, ...payload } = props;

    try {
      const queryString = getQueryString({
        baseURL: `/namespaces/${namespaceId}/catalogs/${catalogId}`,
      });

      const data = await this._client.put<UpdateNamespaceCatalogResponse>(
        queryString,
        {
          body: JSON.stringify(payload),
        },
      );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteNamespaceCatalog({
    namespaceId,
    catalogId,
  }: DeleteNamespaceCatalogRequest) {
    try {
      const queryString = getQueryString({
        baseURL: `/namespaces/${namespaceId}/catalogs/${catalogId}`,
      });

      await this._client.delete(queryString);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /* ----------------------------------------------------------------------------
   * Catalog File
   * ---------------------------------------------------------------------------*/

  async createNamespaceCatalogFile(props: CreateNamespaceCatalogFileRequest) {
    const { namespaceId, catalogId, ...payload } = props;

    try {
      const queryString = getQueryString({
        baseURL: `/namespaces/${namespaceId}/catalogs/${catalogId}/files`,
      });

      const data = await this._client.post<CreateNamespaceCatalogFileResponse>(
        queryString,
        {
          body: JSON.stringify(payload),
        },
      );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listPaginatedCatalogFiles({
    namespaceId,
    catalogId,
    pageSize,
    pageToken,
  }: ListPaginatedNamespaceCatalogFilesRequest) {
    try {
      const queryString = getQueryString({
        baseURL: `/namespaces/${namespaceId}/catalogs/${catalogId}/files`,
        pageSize,
        pageToken,
      });

      const data =
        await this._client.get<ListPaginatedNamespaceCatalogFilesResponse>(
          queryString,
        );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listNamespaceCatalogFiles({
    namespaceId,
    catalogId,
    pageSize = 100,
    pageToken,
  }: ListNamespaceCatalogFilesRequest) {
    try {
      const files: ListNamespaceCatalogFilesResponse = [];

      const queryString = getQueryString({
        baseURL: `/namespaces/${namespaceId}/catalogs/${catalogId}/files`,
        pageSize,
        pageToken,
      });

      const data =
        await this._client.get<ListPaginatedNamespaceCatalogFilesResponse>(
          queryString,
        );

      files.push(...data.files);

      if (data.nextPageToken) {
        files.push(
          ...(await this.listNamespaceCatalogFiles({
            namespaceId,
            catalogId,
            pageSize,
            pageToken: data.nextPageToken,
          })),
        );
      }

      return Promise.resolve(files);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteCatalogFile({ fileUid }: DeleteCatalogFileRequest) {
    try {
      await this._client.delete(`/catalogs/files?fileUid=${fileUid}`);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async processCatalogFiles({
    fileUids,
    requesterUid,
  }: ProcessCatalogFilesRequest) {
    try {
      const queryString = getQueryString({
        baseURL: `/catalogs/files/processAsync`,
      });

      const additionalHeaders = getInstillAdditionalHeaders({
        requesterUid: requesterUid,
      });

      const data = await this._client.post<ProcessCatalogFilesResponse>(
        queryString,
        {
          body: JSON.stringify({ fileUids }),
          additionalHeaders,
        },
      );

      return Promise.resolve(data.files);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listNamespaceCatalogChunks({
    namespaceId,
    catalogId,
    fileUid,
    chunkUids,
  }: ListNamespaceCatalogChunksRequest) {
    const queryString = getQueryString({
      baseURL: `/namespaces/${namespaceId}/catalogs/${catalogId}/chunks`,
      fileUid,
      chunkUids,
    });

    try {
      const data =
        await this._client.get<ListNamespaceCatalogChunksResponse>(queryString);

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getNamespaceCatalogSingleSourceOfTruthFile({
    namespaceId,
    catalogId,
    fileUid,
  }: GetNamespaceCatalogSingleSourceOfTruthFileRequest) {
    try {
      const queryString = getQueryString({
        baseURL: `/namespaces/${namespaceId}/catalogs/${catalogId}/files/${fileUid}/source`,
      });

      const data =
        await this._client.get<GetNamespaceCatalogSingleSourceOfTruthFileResponse>(
          queryString,
        );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateCatalogChunk({
    chunkUid,
    retrievable,
  }: UpdateCatalogChunkRequest) {
    const queryString = getQueryString({
      baseURL: `/chunks/${chunkUid}`,
    });

    try {
      const data = await this._client.post<UpdateCatalogChunkResponse>(
        queryString,
        {
          body: JSON.stringify({ retrievable }),
        },
      );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async retrieveSimilarNamespaceCatalogChunks({
    namespaceId,
    catalogId,
    requesterUid,
    textPrompt,
    topK,
  }: RetrieveSimilarNamespaceCatalogChunksRequest) {
    const queryString = getQueryString({
      baseURL: `/namespaces/${namespaceId}/catalogs/${catalogId}/chunks/retrieve`,
    });

    const additionalHeaders = getInstillAdditionalHeaders({
      requesterUid: requesterUid,
    });

    try {
      const data =
        await this._client.post<RetrieveSimilarNamespaceCatalogChunksResponse>(
          queryString,
          {
            body: JSON.stringify({ textPrompt, topK }),
            additionalHeaders,
          },
        );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async askNamespaceCatalogQuestion(props: AskNamespaceCatalogQuestionRequest) {
    const { namespaceId, catalogId, requesterUid, ...payload } = props;

    const queryString = getQueryString({
      baseURL: `/namespaces/${namespaceId}/catalogs/${catalogId}/ask`,
    });

    const additionalHeaders = getInstillAdditionalHeaders({
      requesterUid: requesterUid,
    });

    try {
      const data = await this._client.post<AskNamespaceCatalogQuestionResponse>(
        queryString,
        {
          body: JSON.stringify(payload),
          additionalHeaders,
        },
      );
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listPaginatedNamespaceCatalogRuns(
    props: ListPaginatedNamespaceCatalogRunsRequest,
  ) {
    const { namespaceId, catalogId, pageSize, page, filter, orderBy } = props;

    const queryString = getQueryString({
      baseURL: `/namespaces/${namespaceId}/catalogs/${catalogId}/runs`,
      page,
      pageSize,
      filter,
      orderBy,
    });

    try {
      const data =
        await this._client.get<ListPaginatedNamespaceCatalogRunsResponse>(
          queryString,
        );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listNamespaceCatalogRuns(props: ListNamespaceCatalogRunsRequest) {
    const {
      namespaceId,
      catalogId,
      page,
      pageSize = 100,
      filter,
      orderBy,
    } = props;

    const runs: ListNamespaceCatalogRunsResponse = [];

    const queryString = getQueryString({
      baseURL: `/namespaces/${namespaceId}/catalogs/${catalogId}/runs`,
      page,
      pageSize,
      filter,
      orderBy,
    });

    try {
      const data =
        await this._client.get<ListPaginatedNamespaceCatalogRunsResponse>(
          queryString,
        );

      runs.push(...data.catalogRuns);

      if (data.totalSize / data.pageSize > data.page) {
        runs.push(
          ...(await this.listNamespaceCatalogRuns({
            namespaceId,
            catalogId,
            page: data.page + 1,
            pageSize,
            filter,
            orderBy,
          })),
        );
      }

      return Promise.resolve(runs);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
