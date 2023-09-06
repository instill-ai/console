import { Button, Dialog, Icons } from "@instill-ai/design-system";
import { CodeBlock } from "@instill-ai/toolkit";
import { triggerPipelineSnippets } from "./triggerPipelineSnippets";

// export type TriggerPipelineSnippetModalProps = {};

export const TriggerPipelineSnippetModal = () =>
  // props: TriggerPipelineSnippetModalProps
  {
    return (
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button
            className="h-12 w-12 !px-0 !py-0"
            variant="secondaryGrey"
            size="lg"
          >
            <Icons.CodeBrowser className="h-5 w-5 stroke-semantic-fg-primary" />
          </Button>
        </Dialog.Trigger>
        <Dialog.Content className="!max-w-[560px]">
          <div className="flex flex-col">
            <div className="mb-6 flex flex-row space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-semantic-bg-line">
                <Icons.CodeBrowser className="h-5 w-5 stroke-semantic-fg-primary" />
              </div>
              <div className="flex flex-col">
                <Dialog.Title>Pipeline trigger snippet</Dialog.Title>
                <Dialog.Description>
                  Copy the following code to trigger your pipeline
                </Dialog.Description>
              </div>
            </div>
            <div className="flex w-full rounded-sm border-[1.5px] border-semantic-accent-on-bg bg-semantic-accent-bg p-2">
              <CodeBlock
                showLineNumbers={true}
                codeString={triggerPipelineSnippets.ce}
                wrapLines={true}
                wrapLongLines={true}
                customStyle={{
                  borderRadius: "0.5rem",
                  fontSize: "10px",
                  innerWidth: "100%",
                  backgroundColor: "white",
                }}
              />
            </div>
          </div>
          <Dialog.Close />
        </Dialog.Content>
      </Dialog.Root>
    );
  };
