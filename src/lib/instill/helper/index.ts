import { Nullable } from "@/types/general";
import axios from "axios";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

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

export const getTemplateCodeBlockMdxQuery = async (
  templateName: string,
  match: string,
  value: string
) => {
  try {
    const response = await axios.post("/api/get-template-code-block-mdx", {
      templateName,
      match,
      value,
    });
    return Promise.resolve(response.data as MDXRemoteSerializeResult);
  } catch (err) {
    return Promise.reject(err);
  }
};
