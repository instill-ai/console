import * as React from "react";
import { Command, Icons } from "@instill-ai/design-system";
import {
  ConnectorDefinition,
  InstillJSONSchema,
  InstillStore,
  IteratorDefinition,
  OperatorDefinition,
  isConnectorDefinition,
  isIteratorDefinition,
  isOperatorDefinition,
  useConnectorDefinitions,
  useInstillStore,
  useOperatorDefinitions,
  useRouteInfo,
  useShallow,
  useUserPipeline,
} from "../../../lib";
import { ImageWithFallback, LoadingSpin } from "../../../components";
import { useEditor } from "../EditorContext";
import { EditorView } from "@codemirror/view";
import { EditorSelection } from "@uiw/react-codemirror";
import { generateUniqueNodeIdFromDefinition } from "../../pipeline-builder/lib/generateUniqueNodeIdFromDefinition";
import yaml from "js-yaml";
import {
  transformInstillFormTreeToDefaultValue,
  transformInstillFormTreeToInitialSelectedCondition,
  transformInstillJSONSchemaToFormTree,
} from "../../../lib/use-instill-form/transform";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  isEditingIterator: store.isEditingIterator,
});

export const ComponentCmdk = () => {
  const routeInfo = useRouteInfo();
  const [open, setOpen] = React.useState(false);
  const { accessToken, enabledQuery, isEditingIterator } = useInstillStore(
    useShallow(selector)
  );

  const pipeline = useUserPipeline({
    pipelineName: routeInfo.isSuccess ? routeInfo.data.pipelineName : null,
    accessToken,
    enabled: enabledQuery,
  });

  const { editorRef } = useEditor();

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

  function dispatchOnCursor(view: EditorView, text: string) {
    view.dispatch(
      view.state.changeByRange((range) => ({
        changes: [{ from: range.from, insert: text }],
        range: EditorSelection.range(range.from, range.to + text.length),
      }))
    );
  }

  function generateDefaultValue(schema: InstillJSONSchema) {
    const formTree = transformInstillJSONSchemaToFormTree(schema);

    const selectedConditionMap =
      transformInstillFormTreeToInitialSelectedCondition(formTree, {
        initialData: undefined,
      });

    const data = transformInstillFormTreeToDefaultValue(formTree, {
      selectedConditionMap,
    });

    return data;
  }

  function onSelect(
    definition: OperatorDefinition | IteratorDefinition | ConnectorDefinition
  ) {
    if (!pipeline.isSuccess) {
      return;
    }

    const componentIds = pipeline.data.recipe.component
      ? Object.keys(pipeline.data.recipe.component)
      : [];

    const view = editorRef.current?.view;

    if (view) {
      if (isIteratorDefinition(definition)) {
        const id = generateUniqueNodeIdFromDefinition(definition, componentIds);
        const doc = yaml.dump({
          [id]: {
            type: "iterator",
          },
        });

        dispatchOnCursor(view, doc);
      }

      if (isOperatorDefinition(definition)) {
        const id = generateUniqueNodeIdFromDefinition(definition, componentIds);
        const defaultValue = generateDefaultValue(
          definition.spec.componentSpecification
        );

        const doc = yaml.dump({
          [id]: {
            type: definition.id,
            ...defaultValue,
          },
        });

        dispatchOnCursor(view, doc);
      }

      if (isConnectorDefinition(definition)) {
        const id = generateUniqueNodeIdFromDefinition(definition, componentIds);
        const defaultValue = generateDefaultValue(
          definition.spec.componentSpecification
        );
        const doc = yaml.dump({
          [id]: {
            type: definition.id,
            ...defaultValue,
          },
        });

        dispatchOnCursor(view, doc);
      }
    }
  }

  return (
    <Command.Dialog
      dialogContentClassName="w-[600px] h-[450px]"
      open={open}
      onOpenChange={setOpen}
    >
      <Command.Input placeholder="Search component..." />
      <Command.List className="max-h-none">
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
