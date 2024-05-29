"use client";

import {
  Button,
  Icons,
  Skeleton,
  buttonVariants,
} from "@instill-ai/design-system";
import { ImageWithFallback } from "../../../components/ImageWithFallback";
import * as React from "react";
import cn from "clsx";
import { useBlogPosts } from "../../../lib";

export const NewsLetterCard = () => {
  const { data: blogPosts = [], isLoading, isError } = useBlogPosts();
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const NewsLetterCardSkeleton = () => {
    return (
      <div className="flex h-[350px] flex-col gap-y-2 rounded-sm border border-semantic-bg-line p-4">
        <Skeleton className="mb-4 h-6 w-32 rounded bg-semantic-bg-line" />
        <div className="relative h-[250px] w-full">
          <Skeleton className="h-full w-full bg-semantic-bg-line" />
        </div>
        <Skeleton className="h-6 w-24 rounded bg-semantic-bg-line" />
        <Skeleton className="h-6 w-full rounded bg-semantic-bg-line" />
        <Skeleton className="h-6 w-full rounded bg-semantic-bg-line" />
        <Skeleton className="h-6 w-2/3 rounded bg-semantic-bg-line" />
        <div className="mt-auto flex items-center justify-end space-x-2">
          <Skeleton className="h-6 w-6 rounded-full bg-semantic-bg-line" />
          <Skeleton className="h-6 w-6 rounded-full bg-semantic-bg-line" />
        </div>
      </div>
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? prevIndex : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === blogPosts.length - 1 ? prevIndex : prevIndex + 1
    );
  };

  const preloadAdjacentImages = () => {
    const prevIndex = currentIndex === 0 ? 0 : currentIndex - 1;
    const nextIndex =
      currentIndex === blogPosts.length - 1 ? currentIndex : currentIndex + 1;

    const prevImage = new Image();
    prevImage.src = blogPosts[prevIndex].imageUrl;

    const nextImage = new Image();
    nextImage.src = blogPosts[nextIndex].imageUrl;
  };

  React.useEffect(() => {
    if (blogPosts.length > 0) {
      preloadAdjacentImages();
    }
  }, [currentIndex, blogPosts, preloadAdjacentImages]);

  if (isLoading) {
    return <NewsLetterCardSkeleton />;
  }

  if (isError) {
    return <div>Error fetching blog posts.</div>;
  }

  const { imageUrl, title, publishedOn, themeImgAlt, slug } =
    blogPosts[currentIndex];

  return (
    <div className="flex h-[350px] flex-col rounded-sm border border-semantic-bg-line bg-semantic-bg-primary p-3">
      <h2 className="mb-4 font-bold product-headings-heading-3">
        What&apos;s New?
      </h2>
      <div className="relative mb-2 w-full">
        <a
          href={`https://www.instill.tech/blog/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ImageWithFallback
            src={imageUrl}
            width={248}
            height={140}
            alt={themeImgAlt}
            fallbackImg={
              <Icons.Box className="h-8 w-8 stroke-semantic-fg-primary" />
            }
            className="h-[140px] w-[248px] object-cover rounded"
          />
        </a>
      </div>
      <div
        className={cn(
          buttonVariants({ variant: "tertiaryColour", size: "sm" }),
          "pointer-events-none mb-2 w-min whitespace-nowrap rounded-sm py-2 capitalize !px-0"
        )}
      >
        {publishedOn}
      </div>
      <a
        href={`https://www.instill.tech/blog/${slug}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <p className="mb-2 line-clamp-3 overflow-hidden text-semantic-fg-primary product-body-text-3-regular hover:underline">
          {title}
        </p>
      </a>
      <div className="mt-auto flex items-center justify-end space-x-3">
        <Button className="!p-2" variant="tertiaryGrey" onClick={handlePrev}>
          <Icons.ArrowNarrowLeft
            className={`h-4 w-4 ${currentIndex === 0
              ? "cursor-not-allowed stroke-semantic-fg-disabled"
              : "stroke-semantic-fg-secondary"
              }`}
          />
        </Button>
        <Button className="!p-2" variant="tertiaryGrey" onClick={handleNext}>
          <Icons.ArrowNarrowRight
            className={`h-4 w-4 ${currentIndex === blogPosts.length - 1
              ? "cursor-not-allowed stroke-semantic-fg-disabled"
              : "stroke-semantic-fg-secondary"
              }`}
          />
        </Button>
      </div>
    </div>
  );
};
