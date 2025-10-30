import { Button, Icons } from "@instill-ai/design-system";

type FileIsBeingDeletedNotificationProps = {
  handleCloseDeleteMessage: () => void;
  fileName: string;
};

export const FileIsBeingDeletedNotification = ({
  handleCloseDeleteMessage,
  fileName,
}: FileIsBeingDeletedNotificationProps) => {
  return (
    <div className="fixed bottom-4 right-8 flex w-[400px] rounded-sm border border-semantic-bg-line bg-semantic-bg-primary p-4 shadow">
      <Icons.AlertCircle className="mr-4 h-6 w-6 stroke-semantic-accent-on-bg" />
      <div className="mr-4 flex shrink grow basis-0 flex-col items-start justify-start gap-1 self-stretch">
        <div className="self-stretch product-body-text-2-semibold">
          File Deletion in Progress
        </div>
        <div className="self-stretch text-semantic-fg-secondary product-body-text-3-regular mb-4">
          {fileName} is being deleted from the system.
        </div>
      </div>
      <Button
        className="absolute right-2 top-2"
        variant="tertiaryGrey"
        size="sm"
        onClick={handleCloseDeleteMessage}
      >
        <Icons.X className="h-6 w-6 stroke-semantic-fg-secondary" />
      </Button>
    </div>
  );
};
