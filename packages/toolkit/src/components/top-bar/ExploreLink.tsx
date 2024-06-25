"use client";
import cn from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const ExploreLink = () => {
  const pathname = usePathname();

  const isActive = pathname.startsWith("/hub");

  return (
    <div className="my-auto flex flex-row gap-x-1">
      <Link
        href="/hub"
        className={cn(
          "-mb-2 flex h-8 flex-row gap-x-2 border-b-2 text-base font-semibold",
          isActive ? "border-semantic-accent-default" : "border-transparent",
        )}
      >
        Explore
      </Link>
    </div>
  );
};
