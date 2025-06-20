import { GeneralRecord, Permission } from "..";

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
  folder: Pick<InstillFolder, "name" | "description"> & {
    metadata?: GeneralRecord;
  };
};

export type CreateInstillFolderResponse = {
  folder: InstillFolder;
};

export type UpdateInstillFolderRequest = {
  namespaceId: string;
  folderUid: string;
  folder: Pick<InstillFolder, "name" | "description"> & {
    metadata?: GeneralRecord;
  };
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
