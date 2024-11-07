"use client";

import { usePathname, useRouter } from "next/navigation";
import cn from "clsx";
import { Nullable } from "instill-sdk";

import { ToggleGroup } from "@instill-ai/design-system";

type UsageSwitchProps = {
  activeTab: "activity" | "cost";
  setActiveTab: (tab: "activity" | "cost") => void;
  namespaceId: Nullable<string>;
};

export const UsageSwitch = ({
  activeTab,
  setActiveTab,
  namespaceId,
}: UsageSwitchProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const options = [
    { value: "activity", label: "Activity" },
    { value: "cost", label: "Cost" },
  ];

  const handleTabChange = (value: string) => {
    const tab = value as "activity" | "cost";
    setActiveTab(tab);

    if (tab === "activity") {
      router.push(`/${namespaceId}/dashboard/activity`);
    } else {
      if (pathname.includes("/cost/")) {
        const subRoute = pathname.split("/cost/")[1];
        router.push(`/${namespaceId}/dashboard/cost/${subRoute}`);
      } else {
        router.push(`/${namespaceId}/dashboard/cost/pipeline`);
      }
    }
  };

  return (
    <ToggleGroup.Root
      type="single"
      value={activeTab}
      onValueChange={handleTabChange}
      className="flex !h-10 space-x-1 bg-semantic-bg-secondary p-1 rounded-sm border-semantic-bg-line w-fit border"
    >
      {options.map((option) => (
        <ToggleGroup.Item
          key={option.value}
          value={option.value}
          className={cn(
            "flex items-center justify-center px-4 py-2 rounded transition-all duration-200 ease-in-out product-body-text-3-semibold",
            option.value === activeTab
              ? "!bg-semantic-bg-primary shadow !text-semantic-fg-primary pointer-events-none"
              : "bg-transparent text-semantic-fg-disabled hover:bg-semantic-bg-line",
          )}
        >
          {option.label}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
};
