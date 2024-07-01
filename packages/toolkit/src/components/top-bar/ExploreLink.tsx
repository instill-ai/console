"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import cn from "clsx";

export const ExploreLink = () => {
  const pathname = usePathname();

  const isActive = pathname.startsWith("/hub");

  return (
    <div className="my-auto flex flex-row gap-x-1">
      <Link
        href="/hub"
        className={cn(
          "-mb-2 flex h-8 flex-row gap-x-2 border-b-2 text-base font-semibold text-semantic-fg-disabled hover:text-semantic-accent-default",
          isActive ? "text-semantic-fg-primary border-semantic-accent-default" : "border-transparent",
        )}
      >
        Explore
      </Link>
    </div>
  );
};
