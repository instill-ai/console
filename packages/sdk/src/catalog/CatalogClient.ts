import { getInstillAdditionalHeaders, getQueryString } from "../helper";
import { APIResource } from "../main/resource";
import {
  Catalog,
  Chunk,
  ChunkContent,
  CreateCatalogRequest,
  CreateCatalogResponse,
  DeleteCatalogFileRequest,
  DeleteCatalogRequest,
  File,
  FileContent,
  GetChunkContentRequest,
  GetChunkContentResponse,
  GetFileContentRequest,
  GetFileContentResponse,
  GetFileDetailsRequest,
  GetFileDetailsResponse,
  ListCatalogFilesRequest,
  ListCatalogFilesResponse,
  ListCatalogsRequest,
  ListCatalogsResponse,
  ListChunksRequest,
  ListChunksResponse,
  ProcessCatalogFilesRequest,
  ProcessCatalogFilesResponse,
  UpdateCatalogRequest,
  UpdateCatalogResponse,
  UpdateChunkRequest,
  UpdateChunkResponse,
  UploadCatalogFileRequest,
  UploadCatalogFileResponse,
} from "./types";

export class CatalogClient extends APIResource {
  async listCatalogs(
    props: ListCatalogsRequest & { enablePagination: true },
  ): Promise<ListCatalogsResponse>;
  async listCatalogs(
    props: ListCatalogsRequest & { enablePagination: false },
  ): Promise<Catalog[]>;
  async listCatalogs(
    props: ListCatalogsRequest & { enablePagination: boolean },
  ): Promise<ListCatalogsResponse | Catalog[]> {
    const { pageSize, pageToken, view, enablePagination, ownerId } = props;

    try {
      const catalogs: Catalog[] = [];

      const queryString = getQueryString({
        baseURL: `/namespaces/${ownerId}/catalogs`,
        pageSize,
        pageToken,
        view,
      });

      const data = await this._client.get<ListCatalogsResponse>(queryString);

      if (enablePagination) {
        return Promise.resolve(data);
      }

      catalogs.push(...data.catalogs);

      if (data.nextPageToken) {
        catalogs.push(
          ...(await this.listCatalogs({
            pageSize,
            pageToken: data.nextPageToken,
            enablePagination: false,
            view,
            ownerId,
          })),
        );
      }

      return Promise.resolve(catalogs);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async createCatalog(
    props: CreateCatalogRequest,
  ): Promise<CreateCatalogResponse> {
    const { ownerId, payload } = props;

    try {
      const queryString = getQueryString({
        baseURL: `/namespaces/${ownerId}/catalogs`,
      });

      const data = await this._client.post<{ catalog: Catalog }>(queryString, {
        body: JSON.stringify(payload),
      });

      return Promise.resolve(data.catalog);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateCatalog(
    props: UpdateCatalogRequest,
  ): Promise<UpdateCatalogResponse> {
    const { ownerId, catalogId, ...payload } = props;

    try {
      const queryString = getQueryString({
        baseURL: `/namespaces/${ownerId}/catalogs/${catalogId}`,
      });

      const data = await this._client.put<{ catalog: Catalog }>(queryString, {
        body: JSON.stringify(payload),
      });

      return Promise.resolve(data.catalog);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteCatalog(props: DeleteCatalogRequest): Promise<void> {
    const { ownerId, catalogId } = props;

    try {
      const queryString = getQueryString({
        baseURL: `/namespaces/${ownerId}/catalogs/${catalogId}`,
      });

      await this._client.delete(queryString);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async uploadCatalogFile(
    props: UploadCatalogFileRequest,
  ): Promise<UploadCatalogFileResponse> {
    const { ownerId, catalogId, payload } = props;

    try {
      const queryString = getQueryString({
        baseURL: `/namespaces/${ownerId}/catalogs/${catalogId}/files`,
      });

      const data = await this._client.post<{ file: File }>(queryString, {
        body: JSON.stringify(payload),
      });

      return Promise.resolve(data.file);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listCatalogFiles(
    props: ListCatalogFilesRequest & { enablePagination: true },
  ): Promise<ListCatalogFilesResponse>;
  async listCatalogFiles(
    props: ListCatalogFilesRequest & { enablePagination: false },
  ): Promise<File[]>;
  async listCatalogFiles(
    props: ListCatalogFilesRequest & { enablePagination: boolean },
  ): Promise<ListCatalogFilesResponse | File[]> {
    const { ownerId, catalogId, pageSize, pageToken, enablePagination } = props;

    try {
      const files: File[] = [];

      const queryString = getQueryString({
        baseURL: `/namespaces/${ownerId}/catalogs/${catalogId}/files`,
        pageSize,
        pageToken,
      });

      const data =
        await this._client.get<ListCatalogFilesResponse>(queryString);

      if (enablePagination) {
        return Promise.resolve(data);
      }

      files.push(...data.files);

      if (data.nextPageToken) {
        files.push(
          ...(await this.listCatalogFiles({
            ownerId,
            catalogId,
            pageSize,
            pageToken: data.nextPageToken,
            enablePagination: false,
          })),
        );
      }

      return Promise.resolve(files);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteCatalogFile(props: DeleteCatalogFileRequest): Promise<void> {
    const { fileUid } = props;

    try {
      await this._client.delete(`/catalogs/files?fileUid=${fileUid}`);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getFileDetails(
    props: GetFileDetailsRequest,
  ): Promise<GetFileDetailsResponse> {
    const { ownerId, catalogId, fileId } = props;

    try {
      const queryString = getQueryString({
        baseURL: `/namespaces/${ownerId}/catalogs/${catalogId}/files/${fileId}`,
      });

      const data = await this._client.get<{ file: File }>(queryString);
      return Promise.resolve(data.file);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getFileContent(
    props: GetFileContentRequest,
  ): Promise<GetFileContentResponse> {
    const { ownerId, catalogId, fileUid } = props;

    try {
      const queryString = getQueryString({
        baseURL: `/namespaces/${ownerId}/catalogs/${catalogId}/files/${fileUid}/source`,
      });

      const data = await this._client.get<{ sourceFile: FileContent }>(
        queryString,
      );
      return Promise.resolve(data.sourceFile);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async processCatalogFiles(
    props: ProcessCatalogFilesRequest,
  ): Promise<ProcessCatalogFilesResponse> {
    const { fileUids, namespaceUid } = props;

    if (!namespaceUid) {
      return Promise.reject(new Error("namespaceUid not provided"));
    }

    try {
      const queryString = getQueryString({
        baseURL: `/catalogs/files/processAsync`,
      });

      const additionalHeaders = getInstillAdditionalHeaders({
        requesterUid: namespaceUid,
      });

      const data = await this._client.post<{ files: File[] }>(queryString, {
        body: JSON.stringify({ file_uids: fileUids }),
        additionalHeaders,
      });

      return Promise.resolve(data.files);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listChunks(
    props: ListChunksRequest & { enablePagination: true },
  ): Promise<ListChunksResponse>;
  async listChunks(
    props: ListChunksRequest & { enablePagination: false },
  ): Promise<Chunk[]>;
  async listChunks(
    props: ListChunksRequest & { enablePagination: boolean },
  ): Promise<ListChunksResponse | Chunk[]> {
    const {
      namespaceId,
      catalogId,
      fileUid,
      pageSize,
      pageToken,
      enablePagination,
    } = props;

    try {
      const baseUrl = `/namespaces/${namespaceId}/catalogs/${catalogId}/chunks?fileUid=${fileUid}`;

      const queryString = getQueryString({
        baseURL: baseUrl,
        pageSize,
        pageToken,
      });

      const data = await this._client.get<ListChunksResponse>(queryString);

      if (enablePagination) {
        return Promise.resolve(data);
      }

      const chunks = data.chunks || [];
      if (data.nextPageToken) {
        chunks.push(
          ...(await this.listChunks({
            namespaceId,
            catalogId,
            fileUid,
            pageSize,
            pageToken: data.nextPageToken,
            enablePagination: false,
          })),
        );
      }

      return Promise.resolve(chunks);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getChunkContent(
    props: GetChunkContentRequest,
  ): Promise<GetChunkContentResponse> {
    const { namespaceId, catalogId, chunkUid } = props;

    try {
      const queryString = getQueryString({
        baseURL: `/namespaces/${namespaceId}/catalogs/${catalogId}/chunks/${chunkUid}/content`,
      });

      const data = await this._client.get<{ content: ChunkContent }>(
        queryString,
      );
      return Promise.resolve(data.content);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateChunk(props: UpdateChunkRequest): Promise<UpdateChunkResponse> {
    const { chunkUid, retrievable } = props;

    try {
      const queryString = getQueryString({
        baseURL: `/chunks/${chunkUid}`,
      });

      const data = await this._client.post<{ chunk: Chunk }>(queryString, {
        body: JSON.stringify({ retrievable }),
      });

      return Promise.resolve(data.chunk);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
