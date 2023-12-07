import * as React from "react";
import { TabMenu } from "@instill-ai/design-system";
import { Nullable } from "../../../../../lib";

export const Head = ({
  selectedTab,
  setSelectedTab,
}: {
  selectedTab: Nullable<string>;
  setSelectedTab: (value: Nullable<string>) => void;
}) => {
  return (
    <div className="flex rounded-t-[12px] border-b border-semantic-bg-line px-6 pt-2">
      <TabMenu.Root
        value={selectedTab}
        onValueChange={(value) => setSelectedTab(value)}
        className="!gap-x-4"
      >
        <TabMenu.Item value="Share">Share</TabMenu.Item>
        <TabMenu.Item value="Publish">Publish</TabMenu.Item>
      </TabMenu.Root>
    </div>
  );
};
