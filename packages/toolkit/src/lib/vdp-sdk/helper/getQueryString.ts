import { Nullable } from "../../type";

export const getQueryString = ({
  baseURL,
  pageSize,
  nextPageToken,
  filter,
  queryParams,
  order_by,
}: {
  baseURL: string;
  pageSize: Nullable<number>;
  nextPageToken: Nullable<string>;
  filter?: Nullable<string>;
  order_by?: Nullable<string>;

  // Just pure query params, the function will handle tialing '&'
  queryParams?: string;
}) => {
  let url = baseURL;

  if (pageSize || nextPageToken || filter || order_by || queryParams) {
    // Check if the baseURL already has a query string
    if (baseURL.includes("?")) {
      url += "&";
    } else {
      url += "?";
    }
  }

  if (pageSize) {
    url += `page_size=${pageSize}&`;
  }

  if (nextPageToken) {
    url += `page_token=${nextPageToken}&`;
  }

  if (filter) {
    url += `filter=${filter}&`;
  }

  if (order_by) {
    url += `order_by=${order_by}&`;
  }

  if (queryParams) {
    url += `${queryParams}&`;
  }

  if (url.endsWith("&")) {
    url = url.slice(0, -1);
  }

  return url;
};
