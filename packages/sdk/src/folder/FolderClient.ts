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
      const data = await this._client.put<CreateInstillFolderResponse>(
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
}
