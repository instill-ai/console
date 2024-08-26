import { Nullable } from "../../type";

export const getQueryString = ({
  baseURL,
  pageSize,
  nextPageToken,
  page,
  filter,
  queryParams,
  orderBy,
  owner,
  start,
  stop,
  aggregationWindow,
}: {
  baseURL: string;
  pageSize: Nullable<number>;
  nextPageToken?: Nullable<string>;
  page?: Nullable<number>;
  filter?: Nullable<string>;
  orderBy?: Nullable<string>;

  // Just pure query params, the function will handle tialing '&'
  queryParams?: string;
  owner?: string;
  start?: string;
  stop?: string;
  aggregationWindow?: string;
}) => {
  let url = baseURL;

  if (
    pageSize ||
    nextPageToken ||
    page ||
    filter ||
    orderBy ||
    queryParams ||
    owner ||
    start ||
    stop ||
    aggregationWindow
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

  if (nextPageToken) {
    url += `pageToken=${nextPageToken}&`;
  }

  if (page) {
    url += `page=${page}&`;
  }

  if (filter) {
    url += `filter=${filter}&`;
  }

  if (orderBy) {
    url += `orderBy=${orderBy}&`;
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

  if (url.endsWith("&")) {
    url = url.slice(0, -1);
  }

  return url;
};
