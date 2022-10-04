import { GetCodeHikeTemplateSourceProps } from "@/lib/markdown";
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

export type GetCodeHikeTemplateSourceQueryPayload =
  GetCodeHikeTemplateSourceProps;

export const getCodeHikeTemplateSourceQuery = async ({
  templateName,
  replaceRules,
  showCopyButton,
}: GetCodeHikeTemplateSourceQueryPayload) => {
  try {
    const response = await axios.post("/api/get-code-hike-template-source", {
      templateName,
      replaceRules,
      showCopyButton,
    });
    return Promise.resolve(response.data as MDXRemoteSerializeResult);
  } catch (err) {
    return Promise.reject(err);
  }
};
