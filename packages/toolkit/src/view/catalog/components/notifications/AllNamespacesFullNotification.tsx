import { Button, Dialog, Icons } from "@instill-ai/design-system";

type AllNamespacesFullNotificationProps = {
    isOpen: boolean;
    onClose: () => void;
};

export const AllNamespacesFullNotification = ({
    isOpen,
    onClose,
}: AllNamespacesFullNotificationProps) => {
    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Content className="!w-[400px]">
                <div className="flex flex-col gap-y-6">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-semantic-error-bg">
                        <Icons.AlertCircle className="h-6 w-6 stroke-semantic-error-on-bg" />
                    </div>
                    <div className="flex flex-col">
                        <Dialog.Title className="!mx-auto !product-headings-heading-3">
                            All Namespaces Full
                        </Dialog.Title>
                        <Dialog.Description className="!mx-auto !text-center">
                            All your namespaces have reached their Catalog limit. Please remove a Catalog from one of your namespaces before cloning.
                        </Dialog.Description>
                    </div>
                    <div className="flex flex-row justify-end">
                        <Button
                            onClick={onClose}
                            variant="primary"
                            size="lg"
                            className="!px-2.5"
                        >
                            Close
                        </Button>
                    </div>
                </div>
                <Dialog.Close className="absolute right-4 top-4">
                    <Icons.X className="h-4 w-4" />
                </Dialog.Close>
            </Dialog.Content>
        </Dialog.Root>
    );
};