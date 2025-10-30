import { Button, Dialog, Icons } from "@instill-ai/design-system";

export type KnowledgeBaseLimitNotificationProps = {
  isOpen: boolean;
  setIsOpen: () => void;
};

export const KnowledgeBaseLimitNotification = ({
  isOpen,
  setIsOpen,
}: KnowledgeBaseLimitNotificationProps) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Content className="!w-[400px]">
        <div className="flex flex-col gap-y-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-semantic-warning-bg">
            <Icons.AlertTriangle className="h-6 w-6 stroke-semantic-warning-on-bg" />
          </div>
          <div className="flex flex-col">
            <Dialog.Title className="!mx-auto !product-headings-heading-3">
              Knowledge Base Limit Reached
            </Dialog.Title>
            <Dialog.Description className="!mx-auto !text-center">
              This namespace has reached the limit of Knowledge Bases. Please
              consider deleting one if you want to clone one.
            </Dialog.Description>
          </div>
          <div className="flex flex-row justify-end">
            <Button
              onClick={setIsOpen}
              variant="primary"
              size="lg"
              className="!px-2.5"
            >
              Understood
            </Button>
          </div>
        </div>
        <Dialog.Close className="absolute right-4 top-4">
          <Icons.X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Root>
  );
};
