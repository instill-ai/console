import { Button } from "@instill-ai/design-system";

import { EmptyView } from "../../../components";

type EmptyStateProps = {
  onGoToUpload: () => void;
};

const EmptyState = ({ onGoToUpload }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <EmptyView
        iconName="AlertCircle"
        title="No Files Uploaded"
        description="    You have no files uploaded yet. Upload files to add resources and
        references to your catalog."
        className="flex-1"
      />
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
