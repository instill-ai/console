import * as React from "react";
import { Command, Icons } from "@instill-ai/design-system";
import {
  InstillStore,
  useConnectorDefinitions,
  useInstillStore,
  useOperatorDefinitions,
  useShallow,
} from "../../../../lib";
import { ImageWithFallback, LoadingSpin } from "../../../../components";
import { OnSelectComponent } from "../dialogs";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  isEditingIterator: store.isEditingIterator,
});

export const Cmdk = ({ onSelect }: { onSelect: OnSelectComponent }) => {
  const [open, setOpen] = React.useState(false);
  const { accessToken, enabledQuery, isEditingIterator } = useInstillStore(
    useShallow(selector)
  );

  const operatorDefinitions = useOperatorDefinitions({
    enabled: enabledQuery,
    accessToken,
  });

  const aiDefinitions = useConnectorDefinitions({
    connectorType: "CONNECTOR_TYPE_AI",
    enabled: enabledQuery,
    accessToken,
  });

  const applicationDefinitions = useConnectorDefinitions({
    connectorType: "CONNECTOR_TYPE_APPLICATION",
    enabled: enabledQuery,
    accessToken,
  });

  const dataDefinitions = useConnectorDefinitions({
    connectorType: "CONNECTOR_TYPE_DATA",
    enabled: enabledQuery,
    accessToken,
  });

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey) && !isEditingIterator) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isEditingIterator]);

  return (
    <Command.Dialog
      dialogContentClassName="w-[600px] h-[450px]"
      open={open}
      onOpenChange={setOpen}
    >
      <Command.Input placeholder="Search component..." />
      <Command.List className="!h-[450px]">
        <div className="flex flex-row gap-x-2">
          <div className="flex w-1/3 flex-col border-r border-semantic-bg-line">
            <Command.Group heading="Iterators">
              <Command.Item
                onSelect={() => {
                  onSelect({
                    id: "iterator",
                    title: "Iterator",
                    icon: "iterator.svg",
                    name: "iterator/iterator",
                    uid: "uid",
                  });
                  setOpen(false);
                }}
                value="iterators"
              >
                <ImageWithFallback
                  src="/icons/iterator.svg"
                  width={16}
                  height={16}
                  alt="iterator-icon"
                  fallbackImg={
                    <Icons.Box className="h-8 w-8 stroke-semantic-fg-primary" />
                  }
                />
                <p className="my-auto text-left text-semantic-fg-primary product-body-text-3-medium">
                  Iterator
                </p>
              </Command.Item>
            </Command.Group>
            <Command.Group heading="Operators">
              {operatorDefinitions.isSuccess ? (
                operatorDefinitions.data.map((definition) => (
                  <Command.Item
                    onSelect={() => {
                      onSelect(definition);
                      setOpen(false);
                    }}
                    key={definition.id}
                    value={definition.id}
                  >
                    <ImageWithFallback
                      src={`/icons/${definition.id}.svg`}
                      width={16}
                      height={16}
                      alt={`${definition.title}-icon`}
                      fallbackImg={
                        <Icons.Box className="h-8 w-8 stroke-semantic-fg-primary" />
                      }
                    />
                    <p className="my-auto text-left text-semantic-fg-primary product-body-text-3-medium">
                      {definition.title}
                    </p>
                  </Command.Item>
                ))
              ) : (
                <LoadingSpin />
              )}
            </Command.Group>
            <Command.Group heading="AI Components">
              {aiDefinitions.isSuccess ? (
                aiDefinitions.data.map((definition) => (
                  <Command.Item
                    onSelect={() => {
                      onSelect(definition);
                      setOpen(false);
                    }}
                    key={definition.id}
                    value={definition.id}
                  >
                    <ImageWithFallback
                      src={`/icons/${definition.id}.svg`}
                      width={16}
                      height={16}
                      alt={`${definition.title}-icon`}
                      fallbackImg={
                        <Icons.Box className="h-8 w-8 stroke-semantic-fg-primary" />
                      }
                    />
                    <p className="my-auto text-left text-semantic-fg-primary product-body-text-3-medium">
                      {definition.title}
                    </p>
                  </Command.Item>
                ))
              ) : (
                <LoadingSpin />
              )}
            </Command.Group>
            <Command.Group heading="Application Components">
              {applicationDefinitions.isSuccess ? (
                applicationDefinitions.data.map((definition) => (
                  <Command.Item
                    onSelect={() => {
                      onSelect(definition);
                      setOpen(false);
                    }}
                    key={definition.id}
                    value={definition.id}
                  >
                    <ImageWithFallback
                      src={`/icons/${definition.id}.svg`}
                      width={16}
                      height={16}
                      alt={`${definition.title}-icon`}
                      fallbackImg={
                        <Icons.Box className="h-8 w-8 stroke-semantic-fg-primary" />
                      }
                    />
                    <p className="my-auto text-left text-semantic-fg-primary product-body-text-3-medium">
                      {definition.title}
                    </p>
                  </Command.Item>
                ))
              ) : (
                <LoadingSpin />
              )}
            </Command.Group>
            <Command.Group heading="Data Components">
              {dataDefinitions.isSuccess ? (
                dataDefinitions.data.map((definition) => (
                  <Command.Item
                    onSelect={() => {
                      onSelect(definition);
                      setOpen(false);
                    }}
                    key={definition.id}
                    value={definition.id}
                  >
                    <ImageWithFallback
                      src={`/icons/${definition.id}.svg`}
                      width={16}
                      height={16}
                      alt={`${definition.title}-icon`}
                      fallbackImg={
                        <Icons.Box className="h-8 w-8 stroke-semantic-fg-primary" />
                      }
                    />
                    <p className="my-auto text-left text-semantic-fg-primary product-body-text-3-medium">
                      {definition.title}
                    </p>
                  </Command.Item>
                ))
              ) : (
                <LoadingSpin />
              )}
            </Command.Group>
          </div>
        </div>
      </Command.List>
    </Command.Dialog>
  );
};
