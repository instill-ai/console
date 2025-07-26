import { getQueryString } from "../helper";
import { APIResource } from "../main/resource";
import {
  CreateInstillFolderRequest,
  CreateInstillFolderResponse,
  DeleteInstillFolderRequest,
  GetInstillFolderRequest,
  GetInstillFolderResponse,
  InstillFolder,
  ListInstillFoldersRequest,
  ListInstillFoldersResponse,
  ListPaginatedInstillFoldersRequest,
  ListPaginatedInstillFoldersResponse,
  UpdateInstillFolderRequest,
  CreateNamespaceFolderFileRequest,
  CreateNamespaceFolderFileResponse,
  GetNamespaceFolderFileRequest,
  GetNamespaceFolderFileResponse,
  ListPaginatedNamespaceFolderFilesRequest,
  ListPaginatedNamespaceFolderFilesResponse,
  ListNamespaceFolderFilesRequest,
  ListNamespaceFolderFilesResponse,
  DeleteFolderFileRequest,
} from "./types";

export class FolderClient extends APIResource {
  async createInstillFolder(props: CreateInstillFolderRequest) {
    const { namespaceId, ...payload } = props;

    try {
      const data = await this._client.post<CreateInstillFolderResponse>(
        `/namespaces/${namespaceId}/folders`,
        {
          body: JSON.stringify(payload),
        },
      );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getInstillFolder(props: GetInstillFolderRequest) {
    const { namespaceId, folderUid } = props;

    try {
      const response = await this._client.get<GetInstillFolderResponse>(
        `/namespaces/${namespaceId}/folders/${folderUid}`,
      );

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateInstillFolder(props: UpdateInstillFolderRequest) {
    const { namespaceId, folderUid, ...body } = props;

    try {
      const data = await this._client.patch<CreateInstillFolderResponse>(
        `/namespaces/${namespaceId}/folders/${folderUid}`,
        {
          body: JSON.stringify(body),
        },
      );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteInstillFolder(props: DeleteInstillFolderRequest) {
    const { namespaceId, folderUid } = props;

    try {
      await this._client.delete(
        `/namespaces/${namespaceId}/folders/${folderUid}`,
      );

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listPaginatedInstillFolders(props: ListPaginatedInstillFoldersRequest) {
    const { namespaceId, pageToken, pageSize } = props;

    const queryString = getQueryString({
      baseURL: `/namespaces/${namespaceId}/folders`,
      pageToken,
      pageSize,
    });

    try {
      const data =
        await this._client.get<ListPaginatedInstillFoldersResponse>(
          queryString,
        );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listInstillFolders(props: ListInstillFoldersRequest) {
    const { namespaceId, pageToken, pageSize } = props;

    const queryString = getQueryString({
      baseURL: `/namespaces/${namespaceId}/folders`,
      pageToken,
      pageSize,
    });

    const folders: InstillFolder[] = [];

    try {
      const data =
        await this._client.get<ListPaginatedInstillFoldersResponse>(
          queryString,
        );

      folders.push(...data.folders);

      if (data.nextPageToken) {
        folders.push(
          ...(
            await this.listInstillFolders({
              namespaceId,
              pageSize,
              pageToken: data.nextPageToken,
            })
          ).folders,
        );
      }

      const response: ListInstillFoldersResponse = {
        folders,
      };

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async createNamespaceFolderFile(props: CreateNamespaceFolderFileRequest) {
    const { namespaceId, folderUid, ...payload } = props;

    try {
      const queryString = getQueryString({
        baseURL: `/namespaces/${namespaceId}/folders/${folderUid}/files`,
      });

      const data = await this._client.post<CreateNamespaceFolderFileResponse>(
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

  async getNamespaceFolderFile(props: GetNamespaceFolderFileRequest) {
    const { namespaceId, folderUid, fileUid } = props;

    const queryString = getQueryString({
      baseURL: `/namespaces/${namespaceId}/folders/${folderUid}/files/${fileUid}`,
    });

    try {
      const data =
        await this._client.get<GetNamespaceFolderFileResponse>(queryString);

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listPaginatedFolderFiles({
    namespaceId,
    folderUid,
    pageSize,
    pageToken,
  }: ListPaginatedNamespaceFolderFilesRequest) {
    try {
      const queryString = getQueryString({
        baseURL: `/namespaces/${namespaceId}/folders/${folderUid}/files`,
        pageSize,
        pageToken,
      });

      const data =
        await this._client.get<ListPaginatedNamespaceFolderFilesResponse>(
          queryString,
        );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async listNamespaceFolderFiles({
    namespaceId,
    folderUid,
    pageSize = 100,
    pageToken,
  }: ListNamespaceFolderFilesRequest) {
    try {
      const files: ListNamespaceFolderFilesResponse = [];

      const queryString = getQueryString({
        baseURL: `/namespaces/${namespaceId}/folders/${folderUid}/files`,
        pageSize,
        pageToken,
      });

      const data =
        await this._client.get<ListPaginatedNamespaceFolderFilesResponse>(
          queryString,
        );

      files.push(...data.files);

      if (data.nextPageToken) {
        files.push(
          ...(await this.listNamespaceFolderFiles({
            namespaceId,
            folderUid,
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

  async deleteFolderFile({
    namespaceId,
    folderUid,
    fileUid,
  }: DeleteFolderFileRequest) {
    try {
      await this._client.delete(
        `/namespaces/${namespaceId}/folders/${folderUid}/files/${fileUid}`,
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
