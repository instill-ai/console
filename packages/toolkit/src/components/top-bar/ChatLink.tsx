"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import cn from "clsx";

import { useRouteInfo } from "../../lib";

export const ChatLink = () => {
  const routeInfo = useRouteInfo();

  const pathname = usePathname();
  const chatPath = `/${routeInfo.data.namespaceId}/chats`;

  const isActive = pathname.startsWith(chatPath);

  return (
    <div className="my-auto flex flex-row gap-x-1">
      <Link
        href={chatPath}
        className={cn(
          "-mb-2 flex h-8 flex-row gap-x-2 border-b-2 text-base font-semibold text-semantic-fg-disabled hover:text-semantic-accent-default",
          isActive
            ? "text-semantic-fg-primary border-semantic-accent-default"
            : "border-transparent",
        )}
      >
        Chat
      </Link>
    </div>
  );
};
