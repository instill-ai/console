"use client";

import Link from "next/link";
import cn from "clsx";

import {
  buttonVariants,
  ComplicateIcons,
  Icons,
} from "@instill-ai/design-system";

export const TopbarMiscLinks = () => {
  return (
    <div className="my-auto flex flex-row gap-x-1">
      <Link
        href="https://github.com/instill-ai/instill-core"
        className={cn(
          "flex h-8 flex-row gap-x-2",
          buttonVariants({ variant: "secondaryGrey", size: "md" }),
        )}
      >
        <ComplicateIcons.GitHub
          className="h-[14px] w-[14px]"
          fillAreaColor="fill-semantic-fg-disabled"
        />
        GitHub
      </Link>
      <Link
        href="https://www.instill.tech/docs"
        className={cn(
          "flex h-8 flex-row gap-x-2",
          buttonVariants({ variant: "tertiaryGrey", size: "md" }),
        )}
      >
        <Icons.File06 className="h-[14px] w-[14px] stroke-semantic-fg-primary" />
        Docs
      </Link>
      <Link
        href="https://discord.com/invite/sevxWsqpGh"
        className={cn(
          "flex h-8 flex-row gap-x-2",
          buttonVariants({ variant: "tertiaryGrey", size: "md" }),
        )}
      >
        <Icons.MessageSmileSquare className="h-[14px] w-[14px] stroke-semantic-fg-primary" />
        Community
      </Link>
    </div>
  );
};
