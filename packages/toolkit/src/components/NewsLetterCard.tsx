"use client";
import { Icons, Skeleton, buttonVariants } from "@instill-ai/design-system";
import { ImageWithFallback } from "./ImageWithFallback";
import { useState } from "react";
import { useBlogPosts } from "../lib/react-query-service/misc/useBlogPosts";
import cn from "clsx";


const NewsLetterCard = () => {
    const { data: blogPosts = [], isLoading, isError } = useBlogPosts();

    const [currentIndex, setCurrentIndex] = useState(0);

    const NewsLetterCardSkeleton = () => {
        return (
            <div className="flex w-[320px] flex-col gap-y-8">
                <div className="flex flex-col items-center space-y-4">
                    <div className="flex h-40 w-full bg-semantic-bg-line">
                        <Skeleton className="m-auto h-36 w-full stroke-semantic-fg-secondary" />
                    </div>
                    <div className="flex w-full flex-col items-center space-y-1">
                        <Skeleton className="h-6 w-24 rounded bg-semantic-bg-line" />
                        <Skeleton className="h-6 w-16 rounded bg-semantic-bg-line" />
                    </div>
                </div>
            </div>
        );
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
                <div className={`my-1 w-min whitespace-nowrap rounded-sm  px-2 py-2 capitalize hover:!underline ${cn(
                    buttonVariants({ variant: "secondaryColour", size: "md" })
                )}`}>
                    {publishedOn}
                </div>
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