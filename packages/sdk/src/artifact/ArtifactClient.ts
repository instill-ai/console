import { getQueryString } from "../helper";
import { APIResource } from "../main/resource";
import {
  DownloadNamespaceObjectRequest,
  GetNamespaceObjectDownloadURLRequest,
  GetNamespaceObjectDownloadURLResponse,
  GetNamespaceObjectUploadURLRequest,
  GetObjectUploadURLResponse,
  UploadNamespaceObjectRequest,
} from "./types";

export class ArtifactClient extends APIResource {
  async getNamespaceObjectUploadURL({
    namespaceId,
    objectName,
    urlExpireDays,
    lastModifiedTime,
    objectExpireDays,
  }: GetNamespaceObjectUploadURLRequest) {
    const queryString = getQueryString({
      baseURL: `/namespaces/${namespaceId}/object-upload-url`,
      objectName,
      urlExpireDays,
      lastModifiedTime,
      objectExpireDays,
    });

    try {
      const data =
        await this._client.get<GetObjectUploadURLResponse>(queryString);

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async uploadNamespaceObject({
    uploadUrl,
    object,
  }: UploadNamespaceObjectRequest) {
    try {
      await this._client.put(uploadUrl, {
        body: object,
        isFullPath: true,
        isVoidReturn: true,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getNamespaceObjectDownloadURL({
    namespaceId,
    objectUid,
    urlExpireDays,
  }: GetNamespaceObjectDownloadURLRequest) {
    const queryString = getQueryString({
      baseURL: `/namespaces/${namespaceId}/object-download-url`,
      objectUid,
      urlExpireDays,
    });

    try {
      const data =
        await this._client.get<GetNamespaceObjectDownloadURLResponse>(
          queryString,
        );

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async downloadNamespaceObject({
    downloadUrl,
  }: DownloadNamespaceObjectRequest) {
    try {
      const data = await this._client.get<Response>(downloadUrl, {
        isFullPath: true,
        isBlob: true,
      });

      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
