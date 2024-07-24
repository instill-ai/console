import { NextResponse } from 'next/server';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  console.error('GITHUB_TOKEN is not set in environment variables');
}

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
    const dateParts = dateString.split("T")[0]?.split("-");
    if (dateParts && dateParts[1] && dateParts[2]) {
      const year = dateParts[0];
      const month = parseInt(dateParts[1], 10);
      const day = parseInt(dateParts[2], 10);
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      return `${monthNames[month - 1]} ${day}, ${year}`;
    } else {
      return " ";
    }
  } catch (error) {
    console.error("Error parsing date:", error);
    return "";
  }
};

const fetchFromGitHub = async (url: string) => {
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching from GitHub:', error);
    throw error;
  }
};

const fetchBlogPosts = async () => {
  // Fetch the latest release tag
  const tagsResponse = await fetchFromGitHub(
    "https://api.github.com/repos/instill-ai/instill.tech/tags"
  );
  const latestTag = tagsResponse[0]?.name;

  const mdxResponse = await fetchFromGitHub(
    `https://api.github.com/repos/instill-ai/instill.tech/contents/blog?ref=${latestTag}`
  );
  const mdxFiles = mdxResponse.filter((file: any) => file.name.endsWith(".mdx"));

  const blogPostsData: BlogPostData[] = await Promise.all(
    mdxFiles.map(async (file: any) => {
      const fileContent = await fetchFromGitHub(file.download_url);
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
      const draft = metadata.draft === "true";
      return {
        id: file.sha,
        themeImgSrc: metadata.themeImgSrc?.replace(/^"|"$/g, "") || "",
        imageUrl: `https://www.instill.tech${metadata.themeImgSrc?.replace(/^"|"$/g, "")}` || "https://placehold.co/600x400",
        title: metadata.title?.replace(/^"|"$/g, "") || "",
        publishedOn: formatDate(metadata.publishedOn?.replace(/^"|"$/g, "")),
        themeImgAlt: metadata.themeImgAlt || "Blog post image",
        slug: file.path.replace(/^blog\//g, "").replace(/\.mdx$/g, ""),
        draft,
      };
    })
  );

  blogPostsData.sort((a, b) => new Date(b.publishedOn).getTime() - new Date(a.publishedOn).getTime());
  return blogPostsData.filter((post) => !post.draft);
};

export async function GET() {
  try {
    const blogPosts = await fetchBlogPosts();
    return NextResponse.json(blogPosts);
  } catch (error) {
    console.error('Error in GET handler:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export const useBlogPosts = () => {
  return useQuery({
    queryKey: ["blogPosts"],
    queryFn: async () => {
      const response = await fetch('/api/blog-posts');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    retry: 3,
  });
};