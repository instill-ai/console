"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";

import { ToggleGroup } from "@instill-ai/design-system";

import { useRouteInfo } from "../../lib";

type DashboardType = "pipeline" | "credit";

export const DashboardContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const routeInfo = useRouteInfo();

  const type = React.useMemo(() => {
    if (pathname.includes("pipeline")) {
      return "pipeline";
    } else if (pathname.includes("credit")) {
      return "credit";
    }
  }, [pathname]);

  return (
    <div className="flex w-full flex-col">
      <div className="mb-10 flex flex-row items-center">
        <ToggleGroup.Root
          type="single"
          value={type}
          onValueChange={(value: DashboardType) => {
            if (value === "pipeline") {
              router.push(`/${routeInfo.data.namespaceId}/dashboard/pipeline`);
            } else {
              router.push(`/${routeInfo.data.namespaceId}/dashboard/credit`);
            }
          }}
        >
          <ToggleGroup.Item
            value="pipeline"
            className={type === "pipeline" ? "pointer-events-none" : undefined}
          >
            Pipeline
          </ToggleGroup.Item>
          <ToggleGroup.Item
            value="credit"
            className={type === "credit" ? "pointer-events-none" : undefined}
          >
            Credit
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
};
