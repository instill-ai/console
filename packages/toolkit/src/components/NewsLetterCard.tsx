"use client";
import { Icons, buttonVariants } from "@instill-ai/design-system";
import { ImageWithFallback } from "./ImageWithFallback";
import { useState } from "react";
import { useBlogPosts } from "../lib/react-query-service/misc/useBlogPosts";
import cn from "clsx";


type BlogPostData = {
  id: string;
  imageUrl: string;
  title: string;
  publishedOn: string;
  themeImgAlt: string;
  themeImgSrc: string;
  slug: string;
}



const NewsLetterCard = () => {
  const { data: blogPosts = [], isLoading, isError } = useBlogPosts();

  const [currentIndex, setCurrentIndex] = useState(0);

  const NewsLetterCardSkeleton = () => {
    return (
      <div className="flex w-full flex-col px-2">
        <div className="h-[250px] w-full animate-pulse bg-semantic-bg-secondary" />
        <div className="mb-2 h-5 w-1/2 animate-pulse rounded bg-semantic-bg-secondary" />
      </div>
    );
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? 0 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === blogPosts.length - 1 ? prevIndex : prevIndex + 1
    );
  };

  if (isLoading) {
    return <NewsLetterCardSkeleton />;
  }

  if (isError) {
    return <div>Error fetching blog posts.</div>;
  }

  const { imageUrl, title, publishedOn, themeImgAlt, slug } =
    blogPosts[currentIndex];

  return (
    <div className="flex h-[450px] flex-col gap-y-2 rounded-sm border border-semantic-bg-line p-4">
      <h2 className="mb-4 text-product-headings-heading-3 font-bold">What's New?</h2>
      <div className="relative h-[250px] w-full">
        <a
          href={`https://www.instill.tech/blog/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
        >
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
      <div className={cn(buttonVariants({ variant: "secondaryColour", size: "md" }), "my-1 w-min whitespace-nowrap rounded-sm  px-2 py-2 capitalize hover:!underline")}>
        {publishedOn}
      </div>
      <a
        href={`https://www.instill.tech/blog/${slug}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <p className="line-clamp-3 overflow-hidden text-semantic-fg-primary">{title}</p>
      </a>
      <div className="mt-auto flex items-center justify-end">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <Icons.ArrowLeft
            className={`h-6 w-6 ${currentIndex === 0 ? "stroke-semantic-fg-disabled" : "stroke-semantic-fg-secondary"
              }`}
          />
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={currentIndex === blogPosts.length - 1}
        >
          <Icons.ArrowRight
            className={`h-6 w-6 ${currentIndex === blogPosts.length - 1
              ? "stroke-semantic-fg-disabled"
              : "stroke-semantic-fg-secondary"
              }`}
          />
        </button>
      </div>
    </div>
  );
};

export default NewsLetterCard;