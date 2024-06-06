
import * as React from "react";
import { Button, Icons, Input, Separator, Tag, Dialog } from "@instill-ai/design-system";
import { GeneralAppPageProp, useAppEntity } from "../../lib";
import { EntityAvatar } from "../../components";
import { CitationDetails, mockSnippets } from "./components/CitationDetails";

export type ApplicationsPageMainViewProps = GeneralAppPageProp;

const mockMessages = [
  {
    id: 1,
    content: "I'm interested in learning more about AI startups focused on productivity. Give me a summary of the top 3.",
    avatar: "https://example.com/user-avatar.png",
    ownerID: "user123",
  },
  {
    id: 2,
    content: "Here is a brief summary of three AI startups focused on productivity:\n\nAirtable: This company has developed a platform that combines database functionality with the familiarity of a spreadsheet. Users can create collaborative, customizable databases to organize their work and streamline their processes. Airtable leverages machine learning and AI to power smart features such as automated workflows, predictive suggestions, and natural language processing for data search and filtering.\n\nClockwise: Clockwise uses AI to optimize calendars and improve time management for teams. Its platform automatically schedules focus time for deep work, while also ensuring that important meetings are prioritized. Clockwise's AI-powered features include smart calendar assistance, which suggests optimal meeting times and durations, and time-blocking capabilities that help users allocate their time efficiently.\n\nOtter.ai: Otter.ai offers an AI-powered assistant that generates rich transcripts from voice conversations, such as meetings and interviews. Its speech recognition technology can distinguish between multiple speakers and convert speech to text in real time. Otter.ai's productivity benefits include efficient meeting note-taking, improved accessibility, and the ability to quickly search and share voice conversations via text.",
    avatar: "https://example.com/assistant-avatar.png",
    ownerID: "assistant",
  },
];

export const ApplicationsPageMainView = (
  props: ApplicationsPageMainViewProps
) => {
  const { accessToken, enableQuery, router } = props;

  const entity = useAppEntity();


  const [selectedSnippet, setSelectedSnippet] = React.useState<typeof mockSnippets[0] | null>(null);
  const [open, setOpen] = React.useState(false);

  const handleSnippetClick = (snippet: typeof mockSnippets[0]) => {
    setSelectedSnippet(snippet);
    setOpen(true);
  };

  const handleCloseCitationDetails = () => {
    setOpen(false);
    setSelectedSnippet(null);
  };

  return (
    <div className="flex flex-col px-8 gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-semantic-fg-default text-2xl font-semibold">
          app-formated-ID
        </h2>
      </div>
      <Separator dir="horizontal" />
      <div className="flex gap-4">
        <div className="flex flex-col flex-1 rounded shadow">
          <div className="p-2 bg-semantic-bg-base-bg rounded-t border-b border-semantic-bg-line">
            <div className="product-body-text-1-semibold">
              Chat Playground
            </div>
          </div>
          <div className="flex flex-col flex-1 p-6 gap-4">
            {mockMessages.map((message) => (
              <div key={message.id} className="flex gap-7 rounded-lg">
                <EntityAvatar
                  src={message.avatar}
                  className="h-8 w-8"
                  entityName={message.ownerID}
                  fallbackImg={
                    <div className="my-auto flex h-8 w-8 shrink-0 grow-0 rounded-full bg-semantic-bg-line">
                      <Icons.User02 className="m-auto h-4 w-4 stroke-semantic-fg-disabled" />
                    </div>
                  }
                />
                <div className="flex-1 pt-2">
                  <div className="text-gray-800 text-sm leading-[21px] tracking-tight whitespace-pre-wrap">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-end w-full">
              <div className="flex gap-2">
                <Button size="sm" variant="tertiaryGrey">
                  Citations:
                </Button>
                <div className="flex gap-2 flex-wrap">
                  {mockSnippets.map((snippet) => (
                    <Dialog.Root key={snippet.id} open={open} onOpenChange={(open) => setOpen(open)}>
                      <Dialog.Trigger asChild>
                        <Tag
                          size="sm"
                          variant="default"
                          className="!rounded cursor-pointer"
                          onClick={() => handleSnippetClick(snippet)}
                        >
                          {snippet.id}
                        </Tag>
                      </Dialog.Trigger>
                      <Dialog.Content className="">
                        {selectedSnippet && (
                          <CitationDetails
                            snippet={selectedSnippet}
                          />
                        )}
                      </Dialog.Content>
                    </Dialog.Root>
                  ))}
                </div>
              </div>
              <Button variant="tertiaryGrey" size="sm" className="p-4">
                <Icons.Copy07 className="h-4 w-4 stroke-semantic-fg-secondary" />
              </Button>
            </div>
            <div className="mt-auto">
              <Input.Root className="flex items-center gap-2 !rounded px-2 py-4">
                <Input.Core placeholder="Message..." />
                <Button variant="primary" className="px-2 !mr-4" size="sm">
                  <Icons.ArrowNarrowRight className="h-4 w-4 stroke-semantic-fg-on-default" />
                </Button>
              </Input.Root>
            </div>
          </div>
        </div>
        <div className="w-[400px] flex flex-col bg-semantic-bg-surface rounded shadow">
          <div className="py-2 px-3 bg-semantic-bg-base-bg rounded-t border-b border-semantic-bg-line">
            <div className="product-body-text-1-semibold">
              Parameters
            </div>
          </div>
          <div className="flex flex-col p-6 gap-4">
            <div className="product-headings-heading-5">
              Statistics
            </div>
            <div className="flex-col text-semantic-fg-secondary bg-semantic-bg-base-bg rounded px-4 py-2 gap-y-1">
              <div>
                <span className="font-semibold">
                  Reply time:
                </span>
                <span className="">19s</span>
              </div>
              <div className="flex">
                <span className="font-semibold">
                  Cost:
                </span>
                <span className="">$0.011</span>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="product-headings-heading-5">
                Retrieved Snippets
              </div>
              {mockSnippets.slice(0, 2).map((snippet) => (
                <div
                  key={snippet.id}
                  className="p-5 bg-semantic-bg-default rounded-sm shadow border border-semantic-bg-line space-y-2.5"
                >
                  <Tag size="md" variant="default" className="!rounded bg-semantic-bg-base-bg">
                    Top{snippet.id.split("-")[1]}: 0.00{snippet.id.split("-")[1]}
                  </Tag>
                  <Separator />
                  <p className="text-semantic-fg-muted text-sm mb-2">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ac justo vitae sem ultricies consectetur. Import your own text data or write in real-time via Webhook to enhance your LLM context. Effortlessly build a comprehensive knowledge base.
                  </p>
                  <div className="flex justify-end">
                    <Tag size="sm" variant="lightGreen" className="!rounded">
                      Original file name.pdf
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
                <span className="text-semantic-accent-default text-sm font-semibold">
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