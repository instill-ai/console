import * as React from "react";

import { cn, Icons } from "@instill-ai/design-system";

export type EmptyViewProps = {
  iconName: keyof typeof Icons;
  title: string;
  description?: string | React.ReactNode;
  className?: string;
};

export const EmptyView = ({
  iconName,
  title,
  description,
  className,
}: EmptyViewProps) => {
  const Icon = Icons[iconName];

  return (
    <div
      className={cn(
        "h-full w-full flex items-center justify-center",
        className,
      )}
    >
      <div className="relative w-[513px] h-[480px]">
        <img
          src="/images/empty-placeholder.svg"
          width={513}
          height={480}
          alt="Grid"
        />
        <div className="flex items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-sm border w-12 h-12 bg-semantic-fg-on-default border-semantic-bg-line shadow-[0_0_2_0_rgba(0,0,0,0.08)]">
          <Icon className="h-6 w-6 stroke-semantic-fg-primary" />
        </div>
        <div className="absolute top-1/2 left-0 w-full mt-12 flex flex-col gap-y-2">
          <p className="font-semibold text-xl text-semantic-fg-primary text-center">
            {title}
          </p>
          {description ? (
            typeof description === "string" ? (
              <p className="text-semantic-fg-secondary text-center">
                {description}
              </p>
            ) : (
              description
            )
          ) : null}
        </div>
      </div>
    </div>
  );
};
