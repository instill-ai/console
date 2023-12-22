import * as React from "react";
import { Button, Dialog, Input } from "@instill-ai/design-system";
import { Nullable } from "../lib";
import { LoadingSpin } from "./LoadingSpin";

export type GenerateDeleteResourceDialogProps = {
  resourceID: string;
  title: string;
  description: string;
  handleDeleteResource: () => Promise<void>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
};

// You can use the children props to override the default buttons

export const GenerateDeleteResourceDialog = ({
  resourceID,
  title,
  description,
  handleDeleteResource,
  open,
  onOpenChange,
  trigger,
}: GenerateDeleteResourceDialogProps) => {
  const [confirmationCode, setConfirmationCode] =
    React.useState<Nullable<string>>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        {trigger || trigger === null ? (
          trigger
        ) : (
          <Button variant="danger" size="lg">
            Delete
          </Button>
        )}
      </Dialog.Trigger>

      <Dialog.Content className="!w-[512px]">
        <Dialog.Close />
        <div className="mb-6 flex flex-col">
          <h2 className="mb-1 text-center text-semantic-fg-primary product-headings-heading-3">
            {title}
          </h2>
          <p className="mb-6 text-center text-semantic-fg-primary product-body-text-2-regular">
            {description}
          </p>

          <div className="mb-2.5">
            <p className="product-body-text-3-regular">
              Please type{" "}
              <span className="select-all product-body-text-3-semibold">{`${resourceID}`}</span>{" "}
              to confirm.
            </p>
          </div>

          <Input.Root>
            <Input.Core
              id="confirmationCode"
              type="text"
              onChange={(event) => {
                setConfirmationCode(event.target.value);
              }}
              value={confirmationCode || ""}
            />
          </Input.Root>
        </div>
        <div className="flex flex-row gap-x-2">
          <Button
            variant="secondaryGrey"
            size="lg"
            className="!flex-1"
            onClick={() => {
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            size="lg"
            onClick={async () => {
              try {
                setIsDeleting(true);
                await handleDeleteResource();
                setIsDeleting(false);
              } catch (error) {
                console.error(error);
                setIsDeleting(false);
              }
            }}
            disabled={
              isDeleting ? true : resourceID === confirmationCode ? false : true
            }
            className="!flex-1"
          >
            {isDeleting ? (
              <LoadingSpin className="!text-semantic-fg-primary" />
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};
