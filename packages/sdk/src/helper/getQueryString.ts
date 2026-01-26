import { Nullable } from "../types";

export const getQueryString = ({
  baseURL,
  pageSize,
  pageToken,
  filter,
  queryParams,
  orderBy,
  view,
  page,
  visibility,
  owner,
  namespaceId,
  requesterId,
  start,
  stop,
  aggregationWindow,
  showDeleted,
  fileUid,
  chunkUids,
  objectName,
  objectUid,
  urlExpireDays,
  lastModifiedTime,
  objectExpireDays,
  datetime,
  sort,
  rootProjectUid,
  maxDepth,
  includeCollections,
  parentProjectUid,
  projectUid,
  downloadFilename,
  displayName,
  knowledgeBase,
}: {
  baseURL: string;
  pageSize?: number;
  pageToken?: string;
  page?: Nullable<number>;
  filter?: Nullable<string>;
  orderBy?: Nullable<string>;
  view?: string;
  visibility?: string;

  // Just pure query params, the function will handle tialing '&'
  queryParams?: string;
  owner?: string;
  namespaceId?: string;
  requesterId?: Nullable<string>;
  start?: string;
  stop?: string;
  aggregationWindow?: string;
  showDeleted?: boolean;
  fileUid?: string;
  chunkUids?: string[];
  objectName?: string;
  objectUid?: string;
  urlExpireDays?: number;
  lastModifiedTime?: string;
  objectExpireDays?: number;
  datetime?: string;
  sort?: string;
  rootProjectUid?: string;
  maxDepth?: number;
  includeCollections?: boolean;
  parentProjectUid?: string;
  projectUid?: string;
  downloadFilename?: string;
  displayName?: string;
  knowledgeBase?: string;
}) => {
  let url = baseURL;

  if (
    pageSize ||
    page ||
    pageToken ||
    filter ||
    orderBy ||
    view ||
    visibility ||
    queryParams ||
    owner ||
    start ||
    stop ||
    aggregationWindow ||
    showDeleted !== undefined ||
    fileUid ||
    chunkUids ||
    objectName ||
    objectUid ||
    datetime ||
    sort ||
    rootProjectUid ||
    maxDepth ||
    includeCollections ||
    parentProjectUid ||
    projectUid ||
    downloadFilename ||
    displayName ||
    knowledgeBase
  ) {
    // Check if the baseURL already has a query string
    if (baseURL.includes("?")) {
      url += "&";
    } else {
      url += "?";
    }
  }

  if (pageSize) {
    url += `pageSize=${pageSize}&`;
  }

  if (page) {
    url += `page=${page}&`;
  }

  if (pageToken) {
    url += `pageToken=${pageToken}&`;
  }

  if (filter) {
    url += `filter=${filter}&`;
  }

  if (orderBy) {
    url += `orderBy=${orderBy}&`;
  }

  if (view) {
    url += `view=${view}&`;
  }

  if (visibility) {
    url += `visibility=${visibility}&`;
  }

  if (queryParams) {
    url += `${queryParams}&`;
  }

  if (owner) {
    url += `owner=${owner}&`;
  }

  if (namespaceId) {
    url += `namespaceId=${namespaceId}&`;
  }

  if (requesterId) {
    url += `requesterId=${requesterId}&`;
  }

  if (start) {
    url += `start=${start}&`;
  }

  if (stop) {
    url += `stop=${stop}&`;
  }

  if (aggregationWindow) {
    url += `aggregationWindow=${aggregationWindow}&`;
  }

  if (showDeleted) {
    url += `showDeleted=${showDeleted}&`;
  }

  if (fileUid) {
    url += `fileUid=${fileUid}&`;
  }

  if (chunkUids) {
    for (const chunkUid of chunkUids) {
      url += `chunkUids=${chunkUid}&`;
    }
  }

  if (objectName) {
    url += `objectName=${objectName}&`;
  }

  if (objectUid) {
    url += `objectUid=${objectUid}&`;
  }

  if (urlExpireDays) {
    url += `urlExpireDays=${urlExpireDays}&`;
  }

  if (lastModifiedTime) {
    url += `lastModifiedTime=${lastModifiedTime}&`;
  }

  if (objectExpireDays) {
    url += `objectExpireDays=${objectExpireDays}&`;
  }

  if (datetime) {
    url += `datetime=${datetime}&`;
  }

  if (sort) {
    url += `sort=${sort}&`;
  }

  if (rootProjectUid) {
    url += `rootProjectUid=${rootProjectUid}&`;
  }

  if (typeof maxDepth !== "undefined") {
    url += `maxDepth=${maxDepth}&`;
  }

  if (includeCollections) {
    url += `includeCollections=${includeCollections}&`;
  }

  if (parentProjectUid) {
    url += `parentProjectUid=${parentProjectUid}&`;
  }

  if (projectUid) {
    url += `projectUid=${projectUid}&`;
  }

  if (downloadFilename) {
    url += `downloadFilename=${encodeURIComponent(downloadFilename)}&`;
  }

  if (displayName) {
    url += `displayName=${encodeURIComponent(displayName)}&`;
  }

  if (knowledgeBase) {
    url += `knowledgeBase=${encodeURIComponent(knowledgeBase)}&`;
  }

  if (url.endsWith("&")) {
    url = url.slice(0, -1);
  }

  return url;
};
