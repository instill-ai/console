"use client";

import { usePathname, useRouter } from "next/navigation";
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
      className="w-fit"
    >
      {options.map((option) => (
        <ToggleGroup.Item key={option.value} value={option.value}>
          {option.label}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
};
