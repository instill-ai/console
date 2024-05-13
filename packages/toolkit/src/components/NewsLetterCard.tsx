'use client';

import { Icons } from "@instill-ai/design-system";
import { ImageWithFallback } from "./ImageWithFallback";
import { useState } from "react";

const mockData = [
  {
    id: 1,
    imageUrl: "https://placehold.co/600x400",
    tag: "Tag 1",
    text: "May 2024: Dive in AI Building with Instill AI's Hackathon and Local Workshop",
  },
  {
    id: 2,
    imageUrl: "https://placehold.co/600x400",
    tag: "Tag 2",
    text: "June 2024: Explore Advanced AI Techniques in Instill AI's Online Seminar",
  },
];

const NewsLetterCard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? mockData.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === mockData.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="flex flex-col gap-y-2 rounded-sm border border-semantic-bg-line p-2">
      <h2 className="text-2xl font-bold mb-4">What's New?</h2>
      <div className="relative">
        <ImageWithFallback
          src={mockData[currentIndex].imageUrl}
          width={600}
          height={400}
          alt={`test-icon-${currentIndex}`}
          fallbackImg={<Icons.Box className="h-8 w-8 stroke-semantic-fg-primary" />}
          className="w-full"
        />
      </div>
      <button
        type="button"
        className="my-2 capitalize text-semantic-accent-default product-button-button-2 hover:!underline bg-blue-100 rounded-sm px-2 py-1 w-min whitespace-nowrap"
      >
        {mockData[currentIndex].tag}
      </button>
      <p>{mockData[currentIndex].text}</p>
      <div className="flex justify-end items-center mt-2">
        <button
          type="button"
          onClick={handlePrevious}
          className="mr-2"
        >
          <Icons.ChevronLeft className="h-4 w-4 stroke-semantic-accent-default" />
        </button>
        <button
          type="button"
          onClick={handleNext}
        >
          <Icons.ChevronRight className="h-4 w-4 stroke-semantic-accent-default" />
        </button>
      </div>
    </div>
  );
};

export default NewsLetterCard;