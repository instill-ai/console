"use client";

import {
  Button,
  Icons,
  Logo,
  Tabs,
  ScrollArea,
} from "@instill-ai/design-system";
import { AppTopbar, PageBase, CodeBlock } from "@instill-ai/toolkit";
import { useAppAccessToken } from "lib/use-app-access-token";
import { useAppTrackToken } from "lib/useAppTrackToken";
import { useRouter } from "next/navigation";
import { useState } from "react";

const tabTriggerStyle =
  "flex-1 px-3 py-2 text-sm-medium cursor-pointer outline outline-1 outline-semantic-bg-line first:rounded-l-sm last:rounded-r-sm hover:bg-semantic-bg-secondary data-[state=active]:bg-semantic-bg-line";
const tabContentStyle =
  "flex flex-col rounded-b-sm border border-t-0 border-semantic-bg-line";

export function ArtifactPageRender() {
  useAppTrackToken({ enabled: true });
  const [selectedTab, setSelectedTab] = useState("tab1");

  const snippet = "This is a code snippet";
  const recipeString = "This is a recipe string";

  return (
    <>
      <div className="flex flex-row-reverse space-x-4 space-x-reverse">
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="border-semantic flex items-start justify-start"
        >
          <Tabs.List>
            <Tabs.Trigger value="tab1">
              <p className="text-semantic-fg-primary product-body-text-4-semibold">
                Tab 1
              </p>
            </Tabs.Trigger>
            <Tabs.Trigger value="tab2">
              <p className="text-semantic-fg-primary product-body-text-4-semibold">
                Tab 2
              </p>
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1" className="mt-4">
            <Tabs defaultValue="snippet" className="h-[300px] w-[512px]">
              <Tabs.List className="flex w-full flex-row gap-x-0.5 px-2">
                <Tabs.Trigger className={tabTriggerStyle} value="snippet">
                  Trigger Snippet
                </Tabs.Trigger>
                <Tabs.Trigger className={tabTriggerStyle} value="recipe">
                  Recipe
                </Tabs.Trigger>
              </Tabs.List>
              <div className="flex h-full w-full">
                <Tabs.Content className={tabContentStyle} value="snippet">
                  <ScrollArea.Root className="h-full">
                    <CodeBlock
                      codeString={snippet}
                      wrapLongLines={true}
                      language="bash"
                      className="min-h-[288px]"
                      customStyle={{
                        borderRadius: "0.5rem",
                        fontSize: "14px",
                        backgroundColor: "white",
                        width: "100%",
                      }}
                    />
                  </ScrollArea.Root>
                </Tabs.Content>
                <Tabs.Content className={tabContentStyle} value="recipe">
                  <ScrollArea.Root className="h-full">
                    <CodeBlock
                      codeString={recipeString}
                      wrapLongLines={true}
                      language="javascript"
                      customStyle={{
                        fontSize: "14px",
                        backgroundColor: "white",
                        width: "100%",
                      }}
                    />
                  </ScrollArea.Root>
                </Tabs.Content>
              </div>
            </Tabs>
          </Tabs.Content>
          <Tabs.Content value="tab2" className="mt-4">
            <div className="bg-semantic-bg-primary p-4">
              <h2 className="text-semantic-fg-primary product-heading-text-3-semibold">
                Tab 2 Content
              </h2>
              <p className="text-semantic-fg-primary product-body-text-2-regular">
                This is the content for Tab 2.
              </p>
            </div>
          </Tabs.Content>
        </Tabs>
        <Button
          className="my-auto h-10 w-10 !p-3"
          variant="secondaryGrey"
          size="sm"
          // onClick={() => refetch()}
        >
          <Icons.RefreshCw05 className="h-4 w-4 stroke-semantic-fg-primary" />
        </Button>
      </div>
    </>
  );
}