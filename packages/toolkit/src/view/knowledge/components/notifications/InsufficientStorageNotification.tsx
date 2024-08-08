import { Button, Icons } from "@instill-ai/design-system";
import { truncateName } from "../lib/functions";

type InsufficientStorageNotificationProps = {
    handleCloseInsufficientStorageMessage: () => void;
    fileName: string;
    availableSpace: number;
};

export const InsufficientStorageNotification = ({
    handleCloseInsufficientStorageMessage,
    fileName,
    availableSpace
}: InsufficientStorageNotificationProps) => {
    const availableSpaceMB = (availableSpace / (1024 * 1024)).toFixed(2);
    return (
        <div className="fixed bottom-4 right-8 flex w-[400px] rounded-sm border border-semantic-bg-line bg-semantic-bg-primary p-4 shadow">
            <Icons.AlertCircle className="mr-4 h-6 w-6 stroke-semantic-error-on-bg" />
            <div className="mr-4 flex shrink grow basis-0 flex-col items-start justify-start gap-1 self-stretch">
                <div className="self-stretch product-body-text-2-semibold">
                    Upload Limit Reached
                </div>
                <div className="self-stretch product-body-text-2-semibold truncate">
                    {truncateName(fileName)}
                </div>
                <div className="self-stretch text-semantic-fg-secondary product-body-text-3-regular">
                    You have reached your plan&apos;s maximum upload capacity of {availableSpaceMB} MB under your current namespace. Please delete any unnecessary files before attempting further uploads or consider upgrading your plan for additional capacity.
                </div>
            </div>
            <Button
                className="absolute right-2 top-2"
                variant="tertiaryGrey"
                size="sm"
                onClick={handleCloseInsufficientStorageMessage}
            >
                <Icons.X className="h-6 w-6 stroke-semantic-fg-secondary" />
            </Button>
        </div>
    );
};