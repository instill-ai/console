import * as React from "react";
import { Button, Icons, Input, Separator, Tag, Dialog, ScrollArea, Skeleton } from "@instill-ai/design-system";
import { GeneralAppPageProp, InstillStore, useAppEntity, useAuthenticatedUser, useInstillStore, useShallow } from "../../lib";
import { EntityAvatar } from "../../components";
import { CitationDetails } from "./components/CitationDetails";
import { Logo } from "@instill-ai/design-system";
import { useMockCitations, useMockMessages } from "../../lib/react-query-service/applications";
import { CitationSnippet } from "../../lib/vdp-sdk/applications/types";

export type ApplicationsPageMainViewProps = GeneralAppPageProp;

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const ApplicationsPageMainView = (
  props: ApplicationsPageMainViewProps
) => {
  const { accessToken, enableQuery, router } = props;

  const entity = useAppEntity();

  const { enabledQuery } = useInstillStore(useShallow(selector));

  const [selectedCitation, setSelectedCitation] = React.useState<CitationSnippet | null>(null);
  const [open, setOpen] = React.useState(false);
  const [showAllCitations, setShowAllCitations] = React.useState(false);

  const me = useAuthenticatedUser({
    enabled: enabledQuery,
    accessToken,
  });

  const { data: mockMessages = [], isLoading: isMessagesLoading, isError: isMessagesError } = useMockMessages();
  const { data: mockCitations = [], isLoading: isCitationsLoading, isError: isCitationsError } = useMockCitations();

  const handleCitationClick = (citation: CitationSnippet) => {
    setSelectedCitation(citation);
    setOpen(true);
  };

  const toggleShowAllCitations = () => {
    setShowAllCitations((prev) => !prev);
  };

  const displayedCitations = showAllCitations ? mockCitations : mockCitations.slice(0, 6);

  const copyBotResponse = () => {
    const botResponse = mockMessages.find((message) => message.ownerID === "assistant")?.content;
    if (botResponse) {
      navigator.clipboard.writeText(botResponse);
    }
  };

  if (isMessagesLoading || isCitationsLoading) {
    return (
      <div className="flex flex-col px-8 gap-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48 bg-semantic-bg-line" />
        </div>
        <Separator dir="horizontal" />
        <div className="flex gap-4">
          <div className="flex flex-col flex-1 rounded shadow">
            <Skeleton className="h-8 w-full bg-semantic-bg-line" />
            <div className="flex flex-col flex-1 p-6 gap-4">
              <Skeleton className="h-8 w-full bg-semantic-bg-line" />
              <Skeleton className="h-8 w-full bg-semantic-bg-line" />
              <Skeleton className="h-8 w-full bg-semantic-bg-line" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isMessagesError || isCitationsError) {
    return <div>Error occurred while fetching data.</div>;
  }

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
          <div className="p-2 bg-semantic-bg-base-bg rounded-t border-b border-semantic-bg-line product-body-text-1-semibold">
            Chat Playground
          </div>
          <div className="flex flex-col flex-1 p-6 gap-4">
            <ScrollArea.Root className="h-96">
              {mockMessages.map((message) => (
                <div key={message.id} className="flex gap-7 rounded-lg">
                  {message.ownerID === 'assistant' ? (
                    <Logo variant="colourLogomark" width={38} className="mt-2" />
                  ) : (
                    <EntityAvatar
                      src={me.data?.profile?.avatar ?? null}
                      className="h-8 w-8 "
                      entityName={me.data?.name ?? ''}
                      fallbackImg={
                        <div className="flex h-8 w-8 mt-2 shrink-0 grow-0 rounded-full bg-semantic-bg-line">
                          <Icons.User02 className="m-auto h-4 w-4 stroke-semantic-fg-disabled" />
                        </div>
                      }
                    />
                  )}
                  <div className="flex-1 pt-2 text-semantic-fg-primary whitespace-pre-wrap product-body-text-3-regular">
                    {message.content.split("\n").map((line, index) => (
                      <React.Fragment key={index}>
                        {line.startsWith("$") ? (
                          <span className="bg-semantic-bg-secondary">{line.slice(1)}</span>
                        ) : (
                          <div>{line}</div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </ScrollArea.Root>
            <div className="flex justify-between items-end w-full mb-auto">
              <div className="flex gap-2">
                <Button size="sm" variant="tertiaryGrey">
                  Citations:
                </Button>
                <div className="flex gap-2 flex-wrap">
                  {displayedCitations.map((citation) => (
                    <Dialog.Root key={citation.id} open={open} onOpenChange={(open) => setOpen(open)}>
                      <Dialog.Trigger asChild>
                        <Tag
                          size="sm"
                          variant="default"
                          className="!rounded cursor-pointer"
                          onClick={() => handleCitationClick(citation as CitationSnippet)}
                        >
                          {citation.id}
                        </Tag>
                      </Dialog.Trigger>
                      <Dialog.Content className="">
                        {selectedCitation && (
                          <CitationDetails citation={selectedCitation} />
                        )}
                      </Dialog.Content>
                    </Dialog.Root>
                  ))}
                  {mockCitations.length > 6 && (
                    <Tag
                      size="sm"
                      variant="default"
                      className="!rounded cursor-pointer p-1"
                      onClick={toggleShowAllCitations}
                    >
                      {showAllCitations ? (
                        <Icons.X className="stroke-semantic-fg-secondary w-3 h-3 active:stroke-semantic-accent-default" />
                      ) : (
                        <Icons.Plus className="stroke-semantic-fg-secondary w-3 h-3 active:stroke-semantic-accent-default" />
                      )}
                    </Tag>
                  )}
                </div>
              </div>
              <Button variant="tertiaryGrey" size="sm" className="p-4" onClick={copyBotResponse}>
                <Icons.Copy07 className="h-4 w-4 stroke-semantic-fg-secondary active:stroke-semantic-accent-default" />
              </Button>
            </div>
            <Input.Root className="flex items-center gap-2 !rounded px-2 py-4">
              <Input.Core placeholder="Message..." />
              <Button variant="primary" className="px-2 !mr-4" size="sm">
                <Icons.ArrowNarrowRight className="h-4 w-4 stroke-semantic-fg-on-default" />
              </Button>
            </Input.Root>
          </div>
        </div>
        <div className="w-[400px] flex flex-col bg-semantic-bg-surface rounded shadow">
          <div className="py-2 px-3 product-body-text-1-semibold bg-semantic-bg-base-bg rounded-t border-b border-semantic-bg-line">
            Parameters
          </div>
          <div className="flex flex-col p-6 gap-4">
            <div className="product-headings-heading-5">
              Statistics
            </div>
            <div className="flex-col text-semantic-fg-secondary bg-semantic-bg-base-bg rounded px-4 py-2 gap-y-1">
              <div className="flex">
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
              <ScrollArea.Root className="h-96">
                <div className="space-y-4">
                  {mockCitations.map((citation) => (
                    <div
                      key={citation.id}
                      className="p-5 bg-semantic-bg-default rounded-sm shadow border border-semantic-bg-line space-y-2.5"
                    >
                      <Tag size="md" variant="default" className="!rounded bg-semantic-bg-base-bg">
                        Top{citation.id.split("-")[1]}: 0.00{citation.id.split("-")[1]}
                      </Tag>
                      <Separator />
                      <p className="product-body-text-3-regular text-semantic-fg-secondary">
                        {citation.content}
                      </p>
                      <div className="flex justify-end">
                        <Tag size="sm" variant="lightGreen" className="!rounded gap-x-1">
                          <Icons.File05 className="stroke-semantic-success-hover h-2.5 w-2.5" />Original file name.pdf
                        </Tag>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea.Root>
            </div>
            <div className="flex-col items-center gap-2">
              <span className="text-semantic-fg-default product-button-button-2">
                Pipeline in use:
              </span>
              <div className="flex items-center space-x-1 hover:underline hover:cursor-pointer">
                <Icons.Pipeline className="h-4 w-4 stroke-semantic-accent-default" />
                <span className="text-semantic-accent-default product-button-button-2">
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