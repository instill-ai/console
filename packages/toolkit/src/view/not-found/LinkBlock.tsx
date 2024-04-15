"use client";

import { Button, Icons } from "@instill-ai/design-system";
import { useRouter } from "next/navigation";
import * as React from "react";

export const LinkBlock = ({
  headIcon,
  title,
  description,
  cta,
}: {
  headIcon: React.ReactElement;
  title: string;
  description: string;
  cta: {
    link: string;
    text: string;
  };
}) => {
  const router = useRouter();
  return (
    <div className="flex w-full flex-col bg-[#F9FAFB] p-6">
      <div className="mb-12">{headIcon}</div>
      <div className="flex flex-col">
        <h3 className="mb-2 text-semantic-fg-primary product-headings-heading-3">
          {title}
        </h3>
        <p className="mb-5 text-semantic-fg-disabled product-body-text-2-regular">
          {description}
        </p>
        <div>
          <Button
            onClick={() => router.push(cta.link)}
            variant="tertiaryColour"
            size="lg"
            className="flex gap-x-2"
          >
            {cta.text}
            <Icons.ArrowRight className="h-4 w-4 stroke-semantic-accent-default" />
          </Button>
        </div>
      </div>
    </div>
  );
};
