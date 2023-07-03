import { Dialog, Icons } from "@instill-ai/design-system";
import { ConnectorType, Nullable } from "@instill-ai/toolkit";
import {
  HTMLAttributes,
  ReactElement,
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

type DialogCtxValue = {
  open: boolean;
  setOpen?: (open: boolean) => void;
};

const DialogContext = createContext<DialogCtxValue>({
  open: false,
});

const useDialogContext = () => {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error("useTwitzy must be used within a TwitzyProvider");
  }
  return context;
};

export type SelectConnectorDefinitionDialogProps = {
  children: ReactNode;
  type: ConnectorType;
};

export const SelectConnectorDefinitionDialog = (
  props: SelectConnectorDefinitionDialogProps
) => {
  const { children, type } = props;
  const [open, setOpen] = useState(false);

  const context: DialogCtxValue = useMemo(
    () => ({
      open,
      setOpen: (open: boolean) => {
        setOpen(open);
      },
    }),
    [open]
  );

  let icon: Nullable<ReactElement> = null;
  let dialogTitle: Nullable<string> = null;
  let dialogDescription: Nullable<string> = null;
  let connectorTypeName: Nullable<string> = null;

  if (type === "CONNECTOR_TYPE_SOURCE") {
    icon = <Icons.Database01 className="h-6 w-6 stroke-semantic-fg-primary" />;
    dialogTitle = "Add a new source";
    dialogDescription = "Select a source to add to your pipeline";
    connectorTypeName = "Source";
  } else if (type === "CONNECTOR_TYPE_AI") {
    icon = <Icons.Model className="h-6 w-6 stroke-semantic-fg-primary" />;
    dialogTitle = "Add a new AI";
    dialogDescription = "Select a AI to add to your pipeline";
    connectorTypeName = "AI";
  } else {
    icon = <Icons.Box className="h-6 w-6 stroke-semantic-fg-primary" />;
    dialogTitle = "Add a new destination";
    dialogDescription = "Select a destination to add to your pipeline";
    connectorTypeName = "Destination";
  }

  return (
    <DialogContext.Provider value={context}>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <button className="group mb-6 flex w-full cursor-pointer flex-row justify-between rounded bg-semantic-bg-base-bg px-2 py-2.5">
            <p className="my-auto !capitalize text-semantic-fg-primary product-body-text-1-semibold">
              {connectorTypeName}
            </p>
            <div className="flex h-8 w-8 items-center justify-center rounded bg-semantic-accent-default group-hover:bg-semantic-accent-hover">
              <Icons.Plus className="h-4 w-4 stroke-semantic-bg-primary" />
            </div>
          </button>
        </Dialog.Trigger>
        <Dialog.Content className="flex max-h-[480px] flex-col overflow-y-auto">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[12px] border border-semantic-bg-line">
            {icon}
          </div>
          <Dialog.Header className="mb-4">
            <Dialog.Title className="mx-auto">{dialogTitle}</Dialog.Title>
            <Dialog.Description className="mx-auto">
              {dialogDescription}
            </Dialog.Description>
          </Dialog.Header>
          <div className="grid w-full grid-cols-2 gap-x-6 gap-y-4">
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </DialogContext.Provider>
  );
};

const SelectConnectorDefinitionDialogItem = (
  props: { children: ReactNode } & HTMLAttributes<HTMLDivElement>
) => {
  const { children, onClick, ...passThrough } = props;
  const { setOpen } = useDialogContext();
  return (
    <div
      className="flex cursor-pointer flex-row space-x-2 rounded border border-semantic-bg-line p-2 hover:bg-semantic-accent-bg"
      onClick={(e) => {
        if (!setOpen) return;
        if (onClick) {
          onClick(e);
          setOpen(false);
        }
      }}
      {...passThrough}
    >
      <div className="flex flex-1 flex-row space-x-2">{children}</div>
      <div className="flex h-8 w-8 items-center justify-center">
        <Icons.Plus className="h-4 w-4 stroke-semantic-fg-secondary" />
      </div>
    </div>
  );
};

SelectConnectorDefinitionDialog.Item = SelectConnectorDefinitionDialogItem;
