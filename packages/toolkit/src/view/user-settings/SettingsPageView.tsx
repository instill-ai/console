import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Nullable } from "../../lib";
import { Tabs } from "@instill-ai/design-system";
import { LoadingSpin } from "../../components";

export type SettingsPageViewProps = {
  tabs: SettingTab[];
  enableQuery: boolean;
};

export type SettingTab = {
  id: string;
  name: string;
  element: ReactNode;
};

export const SettingsPageView = (props: SettingsPageViewProps) => {
  const { tabs, enableQuery } = props;
  const router = useRouter();

  const [selectedTab, setSelectedTab] = useState<Nullable<string>>(null);

  useEffect(() => {
    if (selectedTab) {
      return;
    }

    const { tab } = router.query;

    setSelectedTab(
      tab ? tabs.find((e) => e.id === tab)?.id || tabs[0].id : tabs[0].id
    );
  }, [router.query, tabs, selectedTab]);

  return enableQuery ? (
    <Tabs.Root
      value={selectedTab || undefined}
      onValueChange={(value) => setSelectedTab(value)}
    >
      <Tabs.List className="mb-8 flex flex-row gap-x-4 border-b border-[#EAECF0]">
        {tabs.map((tab) => (
          <Tabs.Trigger
            className="border-b-2 border-[#EAECF0] border-opacity-0 px-1 pb-3 pt-[1px] text-base font-semibold leading-4 text-[#667085] data-[state=active]:border-[#1D5BD7] data-[state=active]:border-opacity-100 data-[state=active]:text-[#1D5BD7]"
            key={`tab-trigger-${tab.id}`}
            value={tab.id}
          >
            <span className="font-sans">{tab.name}</span>
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {tabs.map((tab) => (
        <Tabs.Content key={`tab-content-${tab.id}`} value={tab.id}>
          {tab.element}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  ) : (
    <LoadingSpin className="!text-black" />
  );
};
