/* eslint-disable @typescript-eslint/no-explicit-any */

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type BlogPostData = {
  id: string;
  imageUrl: string;
  title: string;
  publishedOn: string;
  themeImgAlt: string;
  themeImgSrc: string;
  slug: string;
  draft: boolean;
};

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "";
  try {
    const dateParts = dateString.split("T")[0].split("-");
    const year = dateParts[0];
    const month = parseInt(dateParts[1], 10);
    const day = parseInt(dateParts[2], 10);
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const formattedDate = `${monthNames[month - 1]} ${day}, ${year}`;
    return formattedDate;
  } catch (error) {
    console.error("Error parsing date:", error);
    return "";
  }
};

const fetchBlogPosts = async () => {
  // Fetch the latest release tag
  const tagsResponse = await axios.get(
    "https://api.github.com/repos/instill-ai/instill.tech/tags"
  );
  const latestTag = tagsResponse.data[0].name;

  const mdxResponse = await axios.get(
    `https://api.github.com/repos/instill-ai/instill.tech/contents/blog?ref=${latestTag}`
  );
  const mdxFiles = mdxResponse.data.filter((file: any) =>
    file.name.endsWith(".mdx")
  );

  const blogPostsData: BlogPostData[] = await Promise.all(
    mdxFiles.map(async (file: any) => {
      const fileResponse = await axios.get(file.download_url);
      const fileContent = fileResponse.data;
      const frontmatterRegex = /---\n([\s\S]*?)\n---/;
      const frontmatterMatch = fileContent.match(frontmatterRegex);
      const frontmatter = frontmatterMatch ? frontmatterMatch[1] : "";
      const metadata: any = {};
      frontmatter.split("\n").forEach((line: string) => {
        const colonIndex = line.indexOf(":");
        if (colonIndex !== -1) {
          const key = line.slice(0, colonIndex).trim();
          const value = line.slice(colonIndex + 1).trim();
          metadata[key] = value;
        }
      });

      const draft = metadata.draft === "true" || false;

      return {
        id: file.sha,
        themeImgSrc: metadata.themeImgSrc.replace(/^"|"$/g, "") || "",
        imageUrl:
          `https://www.instill.tech${metadata.themeImgSrc.replace(/^"|"$/g, "")}` ||
          "https://placehold.co/600x400",
        title: metadata.title?.replace(/^"|"$/g, "") || "",
        publishedOn: formatDate(metadata.publishedOn?.replace(/^"|"$/g, "")),
        themeImgAlt: metadata.themeImgAlt || "Blog post image",
        slug: file.path.replace(/^blog\//g, "").replace(/\.mdx$/g, ""),
        draft: draft,
      };
    })
  );

  blogPostsData.sort(
    (a, b) =>
      new Date(b.publishedOn).getTime() - new Date(a.publishedOn).getTime()
  );

  return blogPostsData.filter((post) => !post.draft);
};

export const useBlogPosts = () => {
  return useQuery({
    queryKey: ["blogPosts"],
    queryFn: fetchBlogPosts,
    retry: 3,
  });
};