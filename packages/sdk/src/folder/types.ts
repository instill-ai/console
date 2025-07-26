import { GeneralRecord, Permission } from "..";
import { File, FileType } from "../catalog/types";

export type InstillCatalogInfo = {
  fileCount: number;
  totalSizeBytes: string;
};

export type InstillFolder = {
  uid: string;
  name: string;
  description: string;
  metadata: GeneralRecord;
  createTime: string;
  updateTime: string;
  catalogId: string;
  permission: Permission;
  catalogInfo: InstillCatalogInfo;
};

export type CreateInstillFolderRequest = {
  namespaceId: string;
  folder: Partial<Pick<InstillFolder, "name" | "description" | "metadata">>;
};

export type CreateInstillFolderResponse = {
  folder: InstillFolder;
};

export type UpdateInstillFolderRequest = {
  namespaceId: string;
  folderUid: string;
  folder: Partial<Pick<InstillFolder, "name" | "description" | "metadata">>;
};

export type DeleteInstillFolderRequest = {
  namespaceId: string;
  folderUid: string;
};

export type GetInstillFolderRequest = {
  namespaceId: string;
  folderUid: string;
};

export type GetInstillFolderResponse = CreateInstillFolderResponse;

export type ListPaginatedInstillFoldersRequest = {
  namespaceId: string;
  pageToken?: string;
  pageSize?: number;
};

export type ListPaginatedInstillFoldersResponse = {
  folders: InstillFolder[];
  nextPageToken: string;
  totalSize: number;
};

export type ListInstillFoldersRequest = ListPaginatedInstillFoldersRequest;

export type ListInstillFoldersResponse = {
  folders: InstillFolder[];
};

export type CreateNamespaceFolderFileRequest = {
  namespaceId: string;
  folderUid: string;
  name?: string;
  type?: FileType;
  content?: string;
  objectUid?: string;
};

export type CreateNamespaceFolderFileResponse = {
  file: File;
};

export type GetNamespaceFolderFileRequest = {
  namespaceId: string;
  folderUid: string;
  fileUid: string;
};

export type GetNamespaceFolderFileResponse = {
  file: File;
};

export type ListPaginatedNamespaceFolderFilesRequest = {
  namespaceId: string;
  folderUid: string;
  pageSize?: number;
  pageToken?: string;
};

export type ListPaginatedNamespaceFolderFilesResponse = {
  files: File[];
  nextPageToken: string;
  totalSize: number;
};

export type ListNamespaceFolderFilesRequest = {
  namespaceId: string;
  folderUid: string;
  pageSize?: number;
  pageToken?: string;
};

export type ListNamespaceFolderFilesResponse = File[];

export type DeleteFolderFileRequest = {
  namespaceId: string;
  folderUid: string;
  fileUid: string;
};
