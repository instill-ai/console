import { Button, Icons, LinkButton } from '@instill-ai/design-system'
import * as React from 'react'

type DeleteFileNotificationProps = {
    deletedFileName: String;
    undoDelete: () => void;
    setShowDeleteMessage: React.Dispatch<React.SetStateAction<boolean>>;
};

const DeleteFileNotification = ({
    deletedFileName,
    undoDelete,
    setShowDeleteMessage
}: DeleteFileNotificationProps) => {
    return (
        <div className="fixed bottom-4 right-8 flex h-[136px] w-[400px] rounded-lg border border-semantic-bg-line bg-semantic-bg-primary p-4 shadow">
            <Icons.AlertTriangle className="mr-4 h-6 w-6 stroke-semantic-warning-on-bg" />
            <div className="mr-4 shrink grow basis-0 flex-col items-start justify-start space-y-4">
                <div className="flex flex-col items-start justify-start gap-1 self-stretch">
                    <div className="self-stretch product-body-text-2-semibold">
                        {deletedFileName} has been deleted
                    </div>
                    <div className="self-stretch text-semantic-fg-secondary product-body-text-3-regular">
                        If this was a mistake, click &quot;Undo Action&quot; to reapply your changes.
                    </div>
                </div>
                <LinkButton
                    className="!p-0"
                    variant="secondary"
                    size="md"
                    onClick={undoDelete}
                >
                    Undo Action
                </LinkButton>
            </div>
            <Button
                className="absolute right-2 top-2"
                variant="tertiaryGrey"
                size="sm"
                onClick={() => setShowDeleteMessage(false)}
            >
                <Icons.X className="h-6 w-6 stroke-semantic-fg-secondary" />
            </Button>
        </div>)
}

export default DeleteFileNotification