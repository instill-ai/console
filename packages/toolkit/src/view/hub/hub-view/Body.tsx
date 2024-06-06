import * as React from "react";
import { Icons, Separator, Tabs } from "@instill-ai/design-system";
import { NewsLetterCard } from "./NewsLetterCard";
import { LatestChangesCard } from "./LatestChangesCard";
import PipelineSection from "./PipelineSection";

export const Body = () => {
  const tabTriggerStyle =
    "text-semantic-fg-disabled product-body-text-3-semibold border-black data-[state=active]:text-semantic-fg-primary border-b-2 border-opacity-0 data-[state=active]:border-opacity-100 data-[state=active]:border-[#316FED] pb-2";

  return (
    <div className="flex justify-between">
      <div className="flex w-full items-center">
        <Tabs.Root
          defaultValue="explore"
          className="mb-8 mt-4 w-full flex-col justify-center"
        >
          <div className="flex flex-col items-center justify-center">
            <Tabs.List className="flex justify-center gap-6">
              <Tabs.Trigger className={tabTriggerStyle} value="explore">
                <span className="text-lg">Explore</span>
              </Tabs.Trigger>
              <Tabs.Trigger className={tabTriggerStyle} value="featured">
                <span className="text-lg">Featured</span>
              </Tabs.Trigger>
            </Tabs.List>
            <Separator orientation="horizontal" />
          </div>
          <div className="bg-semantic-bg-base-bg pt-8">
            <div className="xl:px-30 flex w-full flex-row space-x-4 sm:px-5 md:px-10 lg:px-20">
              <div className="flex w-full flex-col">
                <Tabs.Content value="explore">
                  <PipelineSection tabValue="explore" />
                </Tabs.Content>
                <Tabs.Content value="featured">
                  <PipelineSection tabValue="featured" />
                </Tabs.Content>
              </div>
              <div className="mt-6 flex w-1/6 min-w-[272px] flex-col">
                <div className="sticky top-6">
                  <div className="mb-4">
                    <NewsLetterCard />
                  </div>
                  <LatestChangesCard />
                </div>
              </div>
            </div>
          </div>
        </Tabs.Root>
      </div>
    </div>
  );
};