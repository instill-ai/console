import { Nullable } from "@/types/general";
import axios from "axios";

export const getQueryString = (
  baseUrl: string,
  pageSize: Nullable<number>,
  nextPageToken: Nullable<string>
) => {
  return pageSize
    ? nextPageToken
      ? baseUrl + `&page_size=${pageSize}` + `&page_token=${nextPageToken}`
      : baseUrl + `&page_size=${pageSize}`
    : baseUrl;
};

export const getShikiSourceQuery = async (source: string) => {
  try {
    const response = await axios.post("/api/get-shiki-source", {
      source,
    });
    return Promise.resolve(response.data as string);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getCodeSourceQuery = async (
  templateName: string,
  match: string,
  value: string
) => {
  try {
    const response = await axios.post("/api/get-code-source", {
      templateName,
      match,
      value,
    });
    return Promise.resolve(response.data as string);
  } catch (err) {
    return Promise.reject(err);
  }
};
