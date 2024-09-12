import { Button, Dialog, Icons } from "@instill-ai/design-system";

export type CatalogLimitNotificationProps = {
    isOpen: boolean;
    onClose: () => void;
};

export const CatalogLimitNotification = ({
    isOpen,
    onClose,
}: CatalogLimitNotificationProps) => {
    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Content className="!w-[400px]">
                <div className="flex flex-col gap-y-6">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-semantic-warning-bg">
                        <Icons.AlertTriangle className="h-6 w-6 stroke-semantic-warning-on-bg" />
                    </div>
                    <div className="flex flex-col">
                        <Dialog.Title className="!mx-auto !product-headings-heading-3">
                            Catalog Limit Reached
                        </Dialog.Title>
                        <Dialog.Description className="!mx-auto !text-center">
                            This namespace has reached the limit of Catalogs. Please consider deleting one if you want to clone one.
                        </Dialog.Description>
                    </div>
                    <div className="flex flex-row justify-end">
                        <Button
                            onClick={onClose}
                            variant="primary"
                            size="lg"
                            className="!px-2.5"
                        >
                            Understood
                        </Button>
                    </div>
                </div>
                <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                    <Icons.X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </Dialog.Close>
            </Dialog.Content>
        </Dialog.Root>
    );
};