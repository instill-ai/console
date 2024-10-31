import { Nullable } from "vitest";

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
  start,
  stop,
  aggregationWindow,
  showDeleted,
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
  start?: string;
  stop?: string;
  aggregationWindow?: string;
  showDeleted?: boolean;
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
    showDeleted !== undefined
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

  if (start) {
    url += `start=${start}&`;
  }

  if (stop) {
    url += `stop=${stop}&`;
  }

  if (aggregationWindow) {
    url += `aggregationWindow=${aggregationWindow}&`;
  }

  if (showDeleted !== undefined) {
    url += `showDeleted=${showDeleted}&`;
  }

  if (url.endsWith("&")) {
    url = url.slice(0, -1);
  }

  return url;
};
