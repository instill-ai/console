import axios from "axios";

type listRepoFileContentResponse = {
  content: string;
  download_url: string;
  encoding: string;
  git_url: string;
  html_url: string;
  name: string;
  path: string;
  sha: string;
  size: number;
  type: string;
  url: string;
};

export const listRepoFileContent = async (
  owner: string,
  repo: string,
  path: string
): Promise<listRepoFileContentResponse> => {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
    );

    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};
