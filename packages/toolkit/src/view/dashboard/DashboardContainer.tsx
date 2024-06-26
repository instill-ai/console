"use client";

import * as React from "react";
import cn from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { useRouteInfo } from "../../lib";

export const DashboardContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const routeInfo = useRouteInfo();

  return (
    <div className="flex w-full flex-col">
      <div className="mb-10 flex flex-row items-center">
        {["pipelines", "credit"].map((option) => (
          <button
            key={option}
            className={cn(
              "my-auto flex !h-10 cursor-pointer flex-row items-center justify-center self-stretch !px-4 !py-1 outline outline-1 outline-semantic-bg-line first:rounded-l-sm last:rounded-r-sm hover:bg-semantic-bg-secondary",
              pathname.includes(option)
                ? "bg-semantic-bg-line"
                : "bg-semantic-bg-primary"
            )}
            onClick={() => {
              if (option === "pipelines") {
                router.push(
                  `/${routeInfo.data.namespaceId}/dashboard/pipelines`
                );
              } else {
                router.push(`/${routeInfo.data.namespaceId}/dashboard/credit`);
              }
            }}
          >
            <p className="text-semantic-fg-primary product-body-text-4-semibold">
              {option}
            </p>
          </button>
        ))}
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
};
