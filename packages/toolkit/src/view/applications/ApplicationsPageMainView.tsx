import * as React from "react";
import { Button, Icons, Input, Separator, Tag } from "@instill-ai/design-system";
import { GeneralAppPageProp, useAppEntity } from "../../lib";

export type ApplicationsPageMainViewProps = GeneralAppPageProp;

// const mockMessages = [
//   { id: 1, content: "Hello, how can I assist you today?" },
//   { id: 2, content: "I'm looking for information about AI." },
//   { id: 3, content: "Sure, what would you like to know about AI?" },
// ];

const mockSnippets = [
  {
    id: 1,
    score: 0.003,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ac justo vitae sem ultricies consectetur.",
    fileName: "file1.pdf",
  },
  {
    id: 2,
    score: 0.002,
    content:
      "Import your own text data or write in real-time via Webhook to enhance your LLM context.",
    fileName: "file2.pdf",
  },
];

export const ApplicationsPageMainView = (
  props: ApplicationsPageMainViewProps
) => {
  const { accessToken, enableQuery, router } = props;

  const entity = useAppEntity();

  return (
    <div className="flex flex-col px-8 gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-semantic-fg-default text-2xl font-semibold">
          app-formated-ID
        </h2>
      </div>
      <Separator dir="horizontal" />
      <div className="flex gap-4">
        <div className="flex flex-col flex-1 bg-semantic-bg-surface rounded shadow">
          <div className="p-4 bg-semantic-bg-base-bg rounded-t border-b border-semantic-bg-line">
            <div className=" product-body-text-1-semibold">
              Chat Playground
            </div>
          </div>
          <div className="flex flex-col flex-1 p-6 gap-4">
            {/* <div className="flex flex-col gap-2">
              {mockMessages.map((message) => (
                <div
                  key={message.id}
                  className="p-2 bg-semantic-bg-default rounded border border-semantic-bg-line"
                >
                  {message.content}
                </div>
              ))}
            </div> */}
            <div className="mt-auto">
              <Input.Root className="flex items-center gap-2 !rounded">
                <Input.Core placeholder="Message..." />
                <Button variant="primary" className="px-2" size={"sm"}>
                  <Icons.ArrowNarrowRight className="h-4 w-4 stroke-semantic-fg-on-default" />
                </Button>
              </Input.Root>
            </div>
          </div>
        </div>
        <div className="w-80 flex flex-col bg-semantic-bg-surface rounded shadow">
          <div className="p-4 bg-semantic-bg-base-bg rounded-t border-b border-semantic-bg-line">
            <div className=" product-body-text-1-semibold">
              Parameters
            </div>
          </div>
          <div className="flex flex-col p-6 gap-4">
            <div className="product-headings-heading-5">
              Statistics
            </div>
            <div className="flex-col text-semantic-fg-secondary bg-semantic-bg-base-bg rounded px-4 py-2 gap-y-1 ">
              <div>
                <span className="font-semibold">
                  Reply time:
                </span>
                <span className="">19s</span>
              </div>
              <div className="flex">
                <span className=" font-semibold">
                  Cost:
                </span>
                <span className="">$0.011</span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="product-headings-heading-5">
                Retrieved Snippets
              </div>
              {mockSnippets.map((snippet) => (
                <div
                  key={snippet.id}
                  className="p-5 bg-semantic-bg-default rounded-sm shadow border border-semantic-bg-line space-y-2.5"
                >
                  <Tag size="md" variant="default" className="!rounded">
                    Top{snippet.id}: {snippet.score}
                  </Tag>
                  <Separator />
                  <p className="text-semantic-fg-muted text-sm mb-2">
                    {snippet.content}
                  </p>
                  <div className="flex justify-end">
                    <Tag size="sm" variant="lightGreen" className="!rounded">
                      {snippet.fileName}
                    </Tag>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex-col items-center gap-2">
              <span className="text-semantic-fg-default text-sm font-semibold">
                Pipeline in use:
              </span>
              <div className="flex items-center space-x-1">
                <Icons.Pipeline className="h-4 w-4 stroke-semantic-accent-default" />
                <span className="text-semantic-accent-default text-sm font-semibold ">
                  xiaofei/name-your-pet
                </span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};