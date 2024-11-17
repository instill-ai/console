import { getQueryString } from "../helper";
import { APIResource } from "../main/resource";
import {
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
    namespaceId,
    objectUid,
    object,
  }: UploadNamespaceObjectRequest) {
    const queryString = getQueryString({
      baseURL: `/namespaces/${namespaceId}/blob-urls/${objectUid}`,
    });

    try {
      await this._client.put(queryString, {
        body: object.stream(),
        duplex: "half",
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
}
