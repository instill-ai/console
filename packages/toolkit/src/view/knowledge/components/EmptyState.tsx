import { Button, Icons } from "@instill-ai/design-system";

type EmptyStateProps = {
  onGoToUpload: () => void;
};

const EmptyState = ({ onGoToUpload }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center mt-32">
      <div className="flex h-12 w-12 items-center justify-center rounded-[10px] border border-semantic-bg-line shadow-xs mb-8">
        <Icons.AlertCircle className="w-6 h-6 stroke-semantic-fg-primary" />
      </div>
      <p className="mb-2 product-headings-heading-2">No Files Uploaded</p>
      <p className="mb-4 text-semantic-fg-secondary product-body-text-2-regular">
        You have no files uploaded yet. Upload files to add resources and
        references to your catalog.
      </p>
      <Button
        variant="primary"
        size="lg"
        onClick={(e) => {
          e.preventDefault();
          onGoToUpload();
        }}
      >
        Go to Upload Documents
      </Button>
    </div>
  );
};

export default EmptyState;
