import * as React from "react";
import { Tag, Dialog, Icons } from "@instill-ai/design-system";
import { CitationDetails } from "./CitationDetails";
import { useMockCitations } from "../../../lib/react-query-service/applications";
import { CitationSnippet } from "../../../lib/vdp-sdk/applications";

export const Citations: React.FC = () => {
  const { data: mockCitations = [], isLoading: isCitationsLoading, isError: isCitationsError } = useMockCitations();

  const [selectedCitation, setSelectedCitation] = React.useState<CitationSnippet | null>(null);
  const [open, setOpen] = React.useState(false);
  const [showAllCitations, setShowAllCitations] = React.useState(false);

  const handleCitationClick = (citation: CitationSnippet) => {
    setSelectedCitation(citation);
    setOpen(true);
  };

  const toggleShowAllCitations = () => {
    setShowAllCitations((prev) => !prev);
  };

  const displayedCitations = showAllCitations ? mockCitations : mockCitations.slice(0, 6);

  if (isCitationsLoading) {
    return <div>Loading citations...</div>;
  }

  if (isCitationsError) {
    return <div>Error occurred while fetching citations.</div>;
  }

  return (
    <div className="flex gap-2 flex-wrap items-baseline">
      <div className=" product-button-button-3 text-semantic-fg-secondary">Citations:</div>
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
            {selectedCitation && <CitationDetails citation={selectedCitation} />}
          </Dialog.Content>
        </Dialog.Root>
      ))}
      {mockCitations.length > 6 && (
        <div className="inline-flex items-center">
          <Tag
            size="sm"
            variant="default"
            className="!rounded cursor-pointer p-1 flex items-center"
            onClick={toggleShowAllCitations}
          >
            <div className="flex items-center justify-center w-4 h-4">
              {showAllCitations ? (
                <Icons.X className="stroke-semantic-fg-secondary w-3 h-3 active:stroke-semantic-accent-default" />
              ) : (
                <Icons.Plus className="stroke-semantic-fg-secondary w-3 h-3 active:stroke-semantic-accent-default" />
              )}
            </div>
          </Tag>
        </div>
      )}
    </div>
  );
};