export type ArtifactObject = {
  uid: string;
  name: string;
  size: string;
  contentType: string;
  namespaceUid: string;
  creator: string;
  isUploaded: boolean;
  path: string;
  objectExpireDays: number;
  lastModifiedTime: string;
  createdTime: string;
  updatedTime: string;
};

export type GetNamespaceObjectUploadURLRequest = {
  namespaceId: string;
  objectName: string;
  urlExpireDays?: number;
  lastModifiedTime?: string;
  objectExpireDays?: number;
};

export type GetObjectUploadURLResponse = {
  uploadUrl: string;
  urlExpireAt: string;
  object: ArtifactObject;
};

export type UploadNamespaceObjectRequest = {
  uploadUrl: string;
  object: File;
};

export type GetNamespaceObjectDownloadURLRequest = {
  namespaceId: string;
  objectUid: string;
  urlExpireDays?: number;
};

export type GetNamespaceObjectDownloadURLResponse = {
  downloadUrl: string;
  urlExpireAt: string;
  object: ArtifactObject;
};

export type DownloadNamespaceObjectRequest = {
  downloadUrl: string;
};
