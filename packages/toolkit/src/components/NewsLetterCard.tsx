import { Icons } from "@instill-ai/design-system";
import { ImageWithFallback } from "./ImageWithFallback";
import { useState, useEffect } from "react";
import axios from "axios";

interface BlogPostData {
  id: string;
  imageUrl: string;
  title: string;
  publishedOn: string;
  themeImgAlt: string;
  themeImgSrc: string;
  slug: string;
}

const NewsLetterCard = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPostData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const NewsLetterCardSkeleton = () => {
    return (
      <div className="flex w-full flex-col px-2">
        <div className="h-[250px] w-full animate-pulse bg-semantic-bg-secondary" />
        <div className="mb-2 h-5 w-1/2 animate-pulse rounded bg-semantic-bg-secondary" />
      </div>
    );
  };

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const mdxResponse = await axios.get(
          "https://api.github.com/repos/instill-ai/instill.tech/contents/blog"
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

            frontmatter
              .split("\n")
              .forEach((line: { split: (arg0: string) => [any, any] }) => {
                const [key, value] = line.split(":");
                metadata[key.trim()] = value.trim();
              });

            return {
              id: file.sha,
              themeImgSrc: metadata.themeImgSrc.replace(/^"|"$/g, "") || "",
              imageUrl:
                `https://www.instill.tech${metadata.themeImgSrc.replace(/^"|"$/g, "")}` ||
                "https://placehold.co/600x400",
              title: metadata.title?.replace(/^"|"$/g, "") || "",
              publishedOn: formatDate(
                metadata.publishedOn?.replace(/^"|"$/g, "")
              ),
              themeImgAlt: metadata.themeImgAlt || "Blog post image",
              slug: metadata.slug.replace(/^"|"$/g, "") || ""
            };
          })
        );

        blogPostsData.sort((a, b) => new Date(b.publishedOn).getTime() - new Date(a.publishedOn).getTime());

        setBlogPosts(blogPostsData);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      }
    };

    fetchBlogPosts();
  }, []);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";

    try {
      const dateParts = dateString.split("T")[0].split("-");
      const year = dateParts[0];
      const month = parseInt(dateParts[1], 10);
      const day = parseInt(dateParts[2], 10);

      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];

      const formattedDate = `${monthNames[month - 1]} ${day}, ${year}`;
      return formattedDate;
    } catch (error) {
      console.error("Error parsing date:", error);
      return "";
    }
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? 0 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === blogPosts.length - 1 ? prevIndex : prevIndex + 1
    );
  };

  if (blogPosts.length === 0) {
    return <NewsLetterCardSkeleton />;
  }

  const { imageUrl, title, publishedOn, themeImgAlt, slug } = blogPosts[currentIndex];

  return (
    <div className="flex h-[450px] flex-col gap-y-2 rounded-sm border border-semantic-bg-line p-4">
      <h2 className="mb-4 text-2xl font-bold">What's New?</h2>
      <div className="relative h-[250px] w-full">
        <a href={`https://www.instill.tech/blog/${slug}`} target="_blank" rel="noopener noreferrer">
          <ImageWithFallback
            src={imageUrl}
            width={600}
            height={400}
            alt={themeImgAlt}
            fallbackImg={
              <Icons.Box className="h-8 w-8 stroke-semantic-fg-primary" />
            }
            className="h-full w-full object-cover"
          />
        </a>
      </div>
      <button
        type="button"
        className="my-1 w-min whitespace-nowrap rounded-sm bg-blue-100 px-2 py-2 capitalize text-semantic-accent-default product-button-button-2 hover:!underline "
      >
        {publishedOn}
      </button>
      <a href={`https://www.instill.tech/blog/${slug}`} target="_blank" rel="noopener noreferrer">
        <p className="line-clamp-3 overflow-hidden">{title}</p>
      </a>
      <div className="mt-auto flex items-center justify-end">
        <button
          type="button"
          onClick={handlePrevious}
          className={`mr-2 ${currentIndex === 0 ? "cursor-not-allowed text-gray-400" : ""}`}
          disabled={currentIndex === 0}
        >
          <Icons.ArrowLeft
            className={`h-6 w-6 ${currentIndex === 0 ? "stroke-gray-400" : "stroke-[#1D2433CC]"}`}
          />
        </button>
        <button
          type="button"
          onClick={handleNext}
          className={`${currentIndex === blogPosts.length - 1 ? "cursor-not-allowed text-gray-400" : ""}`}
          disabled={currentIndex === blogPosts.length - 1}
        >
          <Icons.ArrowRight
            className={`h-6 w-6 ${currentIndex === blogPosts.length - 1 ? "stroke-gray-400" : "stroke-[#1D2433CC]"}`}
          />
        </button>
      </div>
    </div>
  );
};

export default NewsLetterCard;
