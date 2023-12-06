import * as React from "react";
import { Dialog, Icons, ScrollArea, Tabs } from "@instill-ai/design-system";
import { CodeBlock } from "../../../components";
import { constructPipelineRecipe } from "../lib";
import { useInstillStore } from "../../../lib";

export type PipelineToolkitModalModalProps = {
  snippet: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const tabTriggerStyle =
  "rounded-t-sm border border-semantic-bg-line bg-semantic-bg-base-bg px-3 py-1.5 text-[#1D2433] text-opacity-80 product-body-text-3-semibold data-[state=active]:bg-semantic-bg-primary data-[state=active]:text-opacity-100";
const tabContentStyle =
  "h-full w-full rounded-sm border border-semantic-bg-line bg-semantic-accent-bg p-2";

export const PipelineToolkitModal = (props: PipelineToolkitModalModalProps) => {
  const { snippet, isOpen, setIsOpen } = props;

  const nodes = useInstillStore((state) => state.nodes);

  const recipeString = React.useMemo(() => {
    return JSON.stringify(constructPipelineRecipe(nodes), null, 2);
  }, [nodes]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <Dialog.Content className="!h-[475px] !max-w-[560px]">
        <div className="flex flex-col">
          <div className="mb-6 flex flex-row space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-semantic-bg-line">
              <Icons.CodeBrowser className="h-5 w-5 stroke-semantic-fg-primary" />
            </div>
            <div className="flex flex-col">
              <Dialog.Title>Pipeline toolkit</Dialog.Title>
              <Dialog.Description>
                The home of useful gadgets for you to better utilitze VDP
                pipeline.
              </Dialog.Description>
            </div>
          </div>
          <Tabs.Root defaultValue="snippet" className="h-[300px] w-[512px]">
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
          </Tabs.Root>
        </div>
        <Dialog.Close />
      </Dialog.Content>
    </Dialog.Root>
  );
};
