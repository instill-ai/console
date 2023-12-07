import * as React from "react";
import { TabMenu } from "@instill-ai/design-system";
import { Nullable } from "../../../lib";

export const Tab = () => {
  const [selectedTab, setSelectedTab] =
    React.useState<Nullable<string>>("Explore");

  return (
    <div className="flex w-full border-b border-semantic-bg-line bg-semantic-bg-primary">
      <div className="mx-auto flex h-[55px] w-[796px]">
        <TabMenu.Root
          value={selectedTab}
          onValueChange={(value) => setSelectedTab(value)}
          disabledDeSelect={true}
          className="mx-auto mt-auto !h-10 w-[227px] !gap-x-6"
        >
          <TabMenu.Item className="!h-10" value="Explore">
            Explore
          </TabMenu.Item>
        </TabMenu.Root>
      </div>
    </div>
  );
};
