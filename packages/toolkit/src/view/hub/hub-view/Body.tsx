import * as React from "react";
import { Separator, Tabs } from "@instill-ai/design-system";
import { NewsLetterCard } from "./NewsLetterCard";
import { LatestChangesCard } from "./LatestChangesCard";
import PipelineSection from "./PipelineSection";
import ModelSection from "./ModelSection";
import cn from "clsx";

export const Body: React.FC = () => {
  const [exploreDataType, setExploreDataType] = React.useState<"pipelines" | "models">("pipelines");
  const [selectedTab, setSelectedTab] = React.useState<"explore" | "featured">("explore");

  const tabTriggerStyle = "text-semantic-fg-disabled product-body-text-3-semibold border-black data-[state=active]:text-semantic-fg-primary border-b-2 border-opacity-0 data-[state=active]:border-opacity-100 data-[state=active]:border-[#316FED] pb-2";
  const dataTypeTriggerStyle = "px-4 h-full border border-semantic-bg-line text-base font-semibold flex items-center justify-center";
  const dataTypeTriggerStyleActive = "cursor-default bg-semantic-accent-bg text-semantic-accent-default";
  const dataTypeTriggerStyleInactive = "bg-semantic-bg-primary cursor-pointer";

  return (
    <div className="flex justify-between bg-semantic-bg-base-bg">
      <Tabs.Root
        defaultValue="explore"
        onValueChange={(value: string) => setSelectedTab(value as "explore" | "featured")}
        className="mb-8 mt-4 w-full flex-col justify-center"
      >
        <div className="flex flex-col items-center justify-center">
          <Tabs.List className={cn("flex justify-center gap-6", exploreDataType === "models" && "[&>*:last-child]:pointer-events-none [&>*:last-child]:opacity-0")}>
            <Tabs.Trigger className={tabTriggerStyle} value="explore">
              <span className="text-lg">Explore</span>
            </Tabs.Trigger>
            <Tabs.Trigger className={tabTriggerStyle} value="featured">
              <span className="text-lg">Featured</span>
            </Tabs.Trigger>
          </Tabs.List>
          <Separator orientation="horizontal" />
        </div>
        <div className="flex w-full flex-row space-x-4 sm:px-5 md:px-10 lg:px-20 xl:px-30">
          <div className="flex w-full flex-col pt-20">
            <Tabs.Content value="explore">
              {exploreDataType === "pipelines" ? (
                <PipelineSection tabValue={selectedTab} />
              ) : (
                <ModelSection tabValue={selectedTab} />
              )}
            </Tabs.Content>
            <Tabs.Content value="featured">
              <PipelineSection tabValue="featured" />
            </Tabs.Content>
          </div>
          <div className="flex w-1/6 min-w-[272px] flex-col">
            <div className="sticky top-6">
              <div className={cn("my-6 h-10", selectedTab === "featured" && "invisible")}>
                <div className="flex h-10 flex-row justify-end">
                  <div
                    onClick={() => setExploreDataType("pipelines")}
                    className={cn(dataTypeTriggerStyle, "rounded-l", exploreDataType === "pipelines" ? dataTypeTriggerStyleActive : dataTypeTriggerStyleInactive)}
                  >
                    Pipelines
                  </div>
                  <div
                    onClick={() => setExploreDataType("models")}
                    className={cn(dataTypeTriggerStyle, "rounded-r border-l-0", exploreDataType === "models" ? dataTypeTriggerStyleActive : dataTypeTriggerStyleInactive)}
                  >
                    Models
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <NewsLetterCard />
              </div>
              <LatestChangesCard />
            </div>
          </div>
        </div>
      </Tabs.Root>
    </div>
  );
};