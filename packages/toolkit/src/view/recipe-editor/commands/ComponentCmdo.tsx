"use client";

import * as React from "react";
import {
  ComponentDefinition,
  IteratorDefinition,
  PipelineRecipe,
} from "instill-sdk";
import { editor } from "monaco-editor";
import YAML from "yaml";

import {
  Button,
  cn,
  Dialog,
  Icons,
  ScrollArea,
  Separator,
  ToggleGroup,
} from "@instill-ai/design-system";

import { ImageWithFallback, LoadingSpin } from "../../../components";
import {
  InstillStore,
  isComponentDefinition,
  isIteratorDefinition,
  Nullable,
  useComponentDefinitions,
  useInstillStore,
  useNamespacePipeline,
  useRouteInfo,
  useShallow,
} from "../../../lib";
import {
  transformInstillFormTreeToDefaultValue,
  transformInstillFormTreeToInitialSelectedCondition,
  transformInstillJSONSchemaToFormTree,
} from "../../../lib/use-instill-form/transform";
import { generateUniqueNodeIdFromDefinition } from "../../pipeline-builder/lib/generateUniqueNodeIdFromDefinition";
import { EditorButtonTooltipWrapper } from "../EditorButtonTooltipWrapper";
import { useIsMac } from "../lib";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  openComponentCmdo: store.openComponentCmdo,
  updateOpenComponentCmdo: store.updateOpenComponentCmdo,
  editorRef: store.editorRef,
  monacoRef: store.monacoRef,
});

const normalComponentIndent = "  ";

const stringfyOptions: YAML.ToStringOptions = {
  indent: 2,
  nullStr: "",
  collectionStyle: "block",
};

function generateComponentDefaultYamlString(
  definition: ComponentDefinition,
  recipe: PipelineRecipe,
  taskName: string,
) {
  const componentIds = recipe.component ? Object.keys(recipe.component) : [];

  const id = generateUniqueNodeIdFromDefinition(definition, componentIds);

  const formTree = transformInstillJSONSchemaToFormTree(
    definition.spec.componentSpecification,
  );

  const selectedConditionMap =
    transformInstillFormTreeToInitialSelectedCondition(formTree, {
      initialData: taskName
        ? {
            task: taskName,
          }
        : undefined,
    });

  const defaultValue = transformInstillFormTreeToDefaultValue(formTree, {
    selectedConditionMap,
    skipPath: ["setup.api-key"],
  });

  const { task, ...restDefaultValue } = defaultValue;

  const doc = YAML.stringify(
    {
      [id]: {
        type: definition.id,
        task,
        ...restDefaultValue,
      },
    },
    stringfyOptions,
  );

  return doc;
}

function generateEventDefaultYamlString(
  definition: ComponentDefinition,
  recipe: PipelineRecipe,
  taskName: string,
) {
  if (!definition.spec.eventSpecifications) {
    return;
  }

  const runOnEventIds = recipe.on ? Object.keys(recipe.on) : [];

  const id = generateUniqueNodeIdFromDefinition(
    definition,
    runOnEventIds,
    "event",
  );

  const targetEventSchema = definition.spec.eventSpecifications[taskName];

  if (!targetEventSchema || !targetEventSchema.configSchema) {
    return;
  }

  const formTree = transformInstillJSONSchemaToFormTree(
    targetEventSchema.configSchema,
  );

  const defaultValue = transformInstillFormTreeToDefaultValue(formTree, {});

  const doc = YAML.stringify(
    {
      [id]: {
        type: definition.id,
        event: taskName,
        config: defaultValue,
        setup: null,
      },
    },
    stringfyOptions,
  );

  return doc;
}

export const ComponentCmdo = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const routeInfo = useRouteInfo();
  const isMac = useIsMac();
  const {
    accessToken,
    enabledQuery,
    openComponentCmdo,
    updateOpenComponentCmdo,
    editorRef,
    monacoRef,
  } = useInstillStore(useShallow(selector));

  const [searchCode, setSearchCode] = React.useState<Nullable<string>>(null);
  const [selectingComponentType, setSelectingComponentType] = React.useState<
    "component" | "event"
  >("component");
  const [selectedComponentDefinition, setSelectedComponentDefinition] =
    React.useState<Nullable<ComponentDefinition | IteratorDefinition>>(null);

  const [selectedTaskName, setSelectedTaskName] =
    React.useState<Nullable<string>>(null);
  const [selectedComponentDefaultValue, setSelectedComponentDefaultValue] =
    React.useState<Nullable<string>>(null);

  const pipeline = useNamespacePipeline({
    namespaceId: routeInfo.data.namespaceId,
    pipelineId: routeInfo.data.resourceId,
    accessToken,
    enabled: enabledQuery && routeInfo.isSuccess,
    view: "VIEW_FULL",
    shareCode: null,
  });

  const definitions = useComponentDefinitions({
    componentType: "all",
    enabled: enabledQuery,
    accessToken,
  });

  const filteredDefinitions = React.useMemo(() => {
    if (!definitions.isSuccess) {
      return [];
    }

    return definitions.data
      .filter((definition) => {
        if (!searchCode) {
          return true;
        }

        return definition.title
          .toLowerCase()
          .includes(searchCode.toLowerCase());
      })
      .sort((a, b) => {
        return a.title.localeCompare(b.title);
      });
  }, [searchCode, definitions.isSuccess, definitions.data]);

  const eventDefinitions = React.useMemo(() => {
    if (!definitions.isSuccess) {
      return [];
    }

    return definitions.data.filter((definition) => {
      return (
        definition.spec.eventSpecifications &&
        definition.spec.eventSpecifications !== null &&
        Object.keys(definition.spec.eventSpecifications).length > 0
      );
    });
  }, [definitions.isSuccess, definitions.data]);

  const filteredAiDefinitions = React.useMemo(() => {
    return filteredDefinitions.filter((definition) => {
      return definition.type === "COMPONENT_TYPE_AI";
    });
  }, [filteredDefinitions]);

  const filteredApplicationDefinitions = React.useMemo(() => {
    return filteredDefinitions.filter((definition) => {
      return definition.type === "COMPONENT_TYPE_APPLICATION";
    });
  }, [filteredDefinitions]);

  const filteredDataDefinitions = React.useMemo(() => {
    return filteredDefinitions.filter((definition) => {
      return definition.type === "COMPONENT_TYPE_DATA";
    });
  }, [filteredDefinitions]);

  const filteredOperatorDefinitions = React.useMemo(() => {
    return filteredDefinitions.filter((definition) => {
      return definition.type === "COMPONENT_TYPE_OPERATOR";
    });
  }, [filteredDefinitions]);

  const filteredGenericDefinitions = React.useMemo(() => {
    return filteredDefinitions.filter((definition) => {
      return definition.type === "COMPONENT_TYPE_GENERIC";
    });
  }, [filteredDefinitions]);

  function onSelectTask(taskName: string) {
    if (
      !pipeline.isSuccess ||
      !pipeline.data.recipe ||
      !editorRef ||
      !selectedComponentDefinition
    ) {
      return;
    }

    const componentIds = pipeline.data.recipe?.component
      ? Object.keys(pipeline.data.recipe.component)
      : [];

    let doc: Nullable<string> = null;

    if (isIteratorDefinition(selectedComponentDefinition)) {
      const id = generateUniqueNodeIdFromDefinition(
        selectedComponentDefinition,
        componentIds,
      );

      doc = YAML.stringify(
        {
          [id]: {
            type: "iterator",
          },
        },
        stringfyOptions,
      );
    }

    if (isComponentDefinition(selectedComponentDefinition)) {
      if (selectingComponentType === "event") {
        const eventDoc = generateEventDefaultYamlString(
          selectedComponentDefinition,
          pipeline.data.recipe,
          taskName,
        );

        if (!eventDoc) {
          return;
        }

        doc = eventDoc;
      } else {
        const componentDoc = generateComponentDefaultYamlString(
          selectedComponentDefinition,
          pipeline.data.recipe,
          taskName,
        );

        if (!componentDoc) {
          return;
        }

        doc = componentDoc;
      }
    }

    setSelectedComponentDefaultValue(doc);
  }

  function onAddComponent() {
    if (!selectedComponentDefaultValue || !editorRef || !monacoRef) {
      return;
    }

    const selection = editorRef.getSelection();
    if (!selection) {
      return;
    }

    const model = editorRef.getModel();
    if (!model) {
      return;
    }

    const yamlLines = selectedComponentDefaultValue
      .split("\n")
      .filter((line) => line.trim() !== "");

    const edits: editor.IIdentifiedSingleEditOperation[] = [];

    const defaultValueAddedIndent = yamlLines
      .map((line) => {
        const indentation = line.match(/^\s*/);

        return (
          (indentation ? indentation[0] + normalComponentIndent : "") +
          line.trim()
        );
      })
      .join("\n");

    edits.push({
      range: new monacoRef.Range(
        selection.startLineNumber,
        1,
        selection.startLineNumber,
        1,
      ),
      text: defaultValueAddedIndent,
    });

    editorRef.executeEdits("cmdk", edits);

    // We need this setTimeout to correctly focus the editor after the edit
    setTimeout(() => {
      editorRef.focus();
      updateOpenComponentCmdo(() => false);
    }, 100);
  }

  function onDialogClose() {
    setSelectedComponentDefinition(null);
    setSelectedTaskName(null);
    setSelectedComponentDefaultValue(null);
    setSearchCode(null);
  }

  function onSelectComponentDefinition(
    definition: ComponentDefinition | IteratorDefinition,
  ) {
    if (!pipeline.isSuccess || !pipeline.data.recipe) {
      return;
    }

    setSelectedComponentDefinition(definition);

    if (isComponentDefinition(definition)) {
      if (
        selectingComponentType === "event" &&
        definition.spec.eventSpecifications
      ) {
        const defaultEvent = Object.keys(
          definition.spec.eventSpecifications,
        )[0];

        if (!defaultEvent) {
          return;
        }

        const doc = generateEventDefaultYamlString(
          definition,
          pipeline.data.recipe,
          defaultEvent,
        );

        if (!doc) {
          return;
        }

        setSelectedComponentDefaultValue(doc);
        setSelectedTaskName(defaultEvent);
        return;
      }

      // set default task
      const defaultTask = definition.tasks[0];

      if (!defaultTask) {
        return;
      }

      const doc = generateComponentDefaultYamlString(
        definition,
        pipeline.data.recipe,
        defaultTask.name,
      );

      setSelectedComponentDefaultValue(doc);
      setSelectedTaskName(defaultTask.name);
      return;
    }

    if (isIteratorDefinition(definition)) {
      const componentIds = pipeline.data.recipe?.component
        ? Object.keys(pipeline.data.recipe.component)
        : [];

      const id = generateUniqueNodeIdFromDefinition(definition, componentIds);

      const doc = YAML.stringify(
        {
          [id]: {
            type: "iterator",
          },
        },
        stringfyOptions,
      );

      setSelectedComponentDefaultValue(doc);
    }
  }

  // Prepare initial selection when the dialog is opened
  function prepareInitialSelection(
    selectingComponentType: "component" | "event",
  ) {
    if (
      !definitions.isSuccess ||
      !pipeline.isSuccess ||
      !pipeline.data.recipe
    ) {
      return;
    }

    if (selectingComponentType === "component") {
      const defaultDefinition = filteredDefinitions[0];

      if (!defaultDefinition) {
        return;
      }

      setSelectedComponentDefinition(defaultDefinition);

      const defaultTask = defaultDefinition.tasks[0];

      if (!defaultTask) {
        return;
      }

      setSelectedTaskName(defaultTask.name);

      const doc = generateComponentDefaultYamlString(
        defaultDefinition,
        pipeline.data.recipe,
        defaultTask.name,
      );

      setSelectedComponentDefaultValue(doc);
    } else {
      const defaultDefinition = eventDefinitions[0];

      if (!defaultDefinition || !defaultDefinition.spec.eventSpecifications) {
        return;
      }

      onSelectComponentDefinition(defaultDefinition);

      const defaultTask = Object.keys(
        defaultDefinition.spec.eventSpecifications,
      )[0];

      if (!defaultTask) {
        return;
      }

      setSelectedTaskName(defaultTask);

      const doc = generateEventDefaultYamlString(
        defaultDefinition,
        pipeline.data.recipe,
        defaultTask,
      );

      if (!doc) {
        return;
      }

      setSelectedComponentDefaultValue(doc);
    }
  }

  // Since we will open or close the dialog from outside of the component,
  // so there has no clear action when we need to initialize the dialog state
  // we will use this hook to reset the dialog state when the dialog is closed
  React.useEffect(() => {
    if (!openComponentCmdo) {
      onDialogClose();
      return;
    }

    prepareInitialSelection(selectingComponentType);
    // We don't need to listen to prepareInitialSelection
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [openComponentCmdo, selectingComponentType]);

  const displayIteratorDefinition = React.useMemo(() => {
    if (!searchCode) {
      return true;
    }

    return "iterator".includes(searchCode.toLowerCase());
  }, [searchCode]);

  function onSwitchComponentType(type: "component" | "event") {
    if (!pipeline.isSuccess || !pipeline.data.recipe) {
      return;
    }

    setSelectingComponentType(type);
    setSearchCode(null);
    prepareInitialSelection(type);
  }

  const generateDocUrl = (baseUrl: string, taskName: string) => {
    return `${baseUrl}#${taskName.replace("TASK_", "").replaceAll("_", "-").toLowerCase()}`;
  };

  return (
    <Dialog.Root
      open={openComponentCmdo}
      onOpenChange={(open) => {
        updateOpenComponentCmdo(() => open);
      }}
    >
      <Dialog.Trigger asChild>
        <EditorButtonTooltipWrapper
          tooltipContent={isMac ? "CMD O" : "CTRL  O"}
        >
          <Button
            onClick={() => {
              updateOpenComponentCmdo(() => true);
            }}
            className="flex flex-row gap-x-2"
            variant="tertiaryGrey"
          >
            <Icons.Plus className="w-[14px] h-[14px] stroke-semantic-fg-primary" />
            Add Component
          </Button>
        </EditorButtonTooltipWrapper>
      </Dialog.Trigger>
      <Dialog.Content
        onOpenAutoFocus={() => {
          // We need this setTimeout to correctly focus the input after the dialog is opened
          setTimeout(() => {
            inputRef.current?.focus();
          });
        }}
        className="flex flex-col w-[761px] h-[480px] !p-6"
      >
        <div className="flex w-full flex-col h-full">
          <div className="flex w-full items-center justify-between flex-row mb-6">
            <h3 className="text-semantic-fg-primary product-headings-heading-3">
              Add Component
            </h3>
            <ToggleGroup.Root
              type="single"
              value={selectingComponentType}
              disabled={!pipeline.isSuccess}
              onValueChange={(value: "component" | "event") =>
                onSwitchComponentType(value)
              }
              className="flex h-10 space-x-1 rounded-sm border border-semantic-bg-line bg-semantic-bg-secondary p-1"
            >
              <ToggleGroup.Item
                value="component"
                className={cn(
                  "flex items-center justify-center rounded px-2.5 py-1.5 transition-all duration-200 ease-in-out product-body-text-3-semibold",
                  selectingComponentType === "component"
                    ? "pointer-events-none !bg-semantic-bg-primary !text-semantic-fg-primary shadow"
                    : "bg-transparent text-semantic-fg-disabled hover:bg-semantic-bg-line",
                )}
              >
                Tasks
              </ToggleGroup.Item>
              <ToggleGroup.Item
                value="event"
                className={cn(
                  "flex items-center justify-center rounded px-2.5 py-1.5 transition-all duration-200 ease-in-out product-body-text-3-semibold",
                  selectingComponentType === "event"
                    ? "pointer-events-none !bg-semantic-bg-primary !text-semantic-fg-primary shadow"
                    : "bg-transparent text-semantic-fg-disabled hover:bg-semantic-bg-line",
                )}
              >
                Events
              </ToggleGroup.Item>
            </ToggleGroup.Root>
            <button
              onClick={() => {
                updateOpenComponentCmdo(() => false);
              }}
              className="p-3 my-auto border border-semantic-bg-line bg-semantic-bg-primary shadow rounded-[10px] hover:bg-semantic-bg-base-bg"
            >
              <Icons.X className="w-6 h-6 stroke-semantic-fg-primary" />
            </button>
          </div>

          <div className="flex flex-row w-full h-full">
            <div className="flex flex-col">
              <div className="w-full mb-3 relative">
                <Icons.SearchSm className="w-4 h-4 absolute top-1/2 -translate-y-1/2 left-[9px] stroke-semantic-fg-primary" />
                <input
                  ref={inputRef}
                  placeholder="Search component..."
                  onChange={(e) => setSearchCode(e.target.value)}
                  className="border w-full pl-[33px] pr-[9px] py-1.5 rounded border-semantic-bg-line"
                />
              </div>
              <ScrollArea.Root className="flex shrink-0 w-[240px] h-[316px]">
                {selectingComponentType === "component" ? (
                  <React.Fragment>
                    <CommandGroup heading="AI">
                      {definitions.isSuccess ? (
                        filteredAiDefinitions.map((definition) => (
                          <CommandItem
                            key={definition.id}
                            onClick={() => {
                              onSelectComponentDefinition(definition);
                            }}
                            definition={definition}
                            isSelected={
                              selectedComponentDefinition?.id === definition.id
                            }
                          />
                        ))
                      ) : (
                        <LoadingSpin />
                      )}
                    </CommandGroup>
                    <CommandGroup heading="Application">
                      {definitions.isSuccess ? (
                        filteredApplicationDefinitions.map((definition) => (
                          <CommandItem
                            key={definition.id}
                            onClick={() => {
                              onSelectComponentDefinition(definition);
                            }}
                            definition={definition}
                            isSelected={
                              selectedComponentDefinition?.id === definition.id
                            }
                          />
                        ))
                      ) : (
                        <LoadingSpin />
                      )}
                    </CommandGroup>
                    <CommandGroup heading="Data">
                      {definitions.isSuccess ? (
                        filteredDataDefinitions.map((definition) => (
                          <CommandItem
                            key={definition.id}
                            onClick={() => {
                              onSelectComponentDefinition(definition);
                            }}
                            definition={definition}
                            isSelected={
                              selectedComponentDefinition?.id === definition.id
                            }
                          />
                        ))
                      ) : (
                        <LoadingSpin />
                      )}
                    </CommandGroup>
                    <CommandGroup heading="Operator">
                      {definitions.isSuccess ? (
                        filteredOperatorDefinitions.map((definition) => (
                          <CommandItem
                            key={definition.id}
                            onClick={() => {
                              onSelectComponentDefinition(definition);
                            }}
                            definition={definition}
                            isSelected={
                              selectedComponentDefinition?.id === definition.id
                            }
                          />
                        ))
                      ) : (
                        <LoadingSpin />
                      )}
                    </CommandGroup>
                    <CommandGroup heading="Generic">
                      {definitions.isSuccess ? (
                        filteredGenericDefinitions.map((definition) => (
                          <CommandItem
                            key={definition.id}
                            onClick={() => {
                              onSelectComponentDefinition(definition);
                            }}
                            definition={definition}
                            isSelected={
                              selectedComponentDefinition?.id === definition.id
                            }
                          />
                        ))
                      ) : (
                        <LoadingSpin />
                      )}
                      {displayIteratorDefinition ? (
                        <CommandItem
                          onClick={() => {
                            if (!pipeline.isSuccess) {
                              return;
                            }

                            const definition: IteratorDefinition = {
                              id: "iterator",
                              title: "Iterator",
                              icon: "iterator.svg",
                              name: "iterator/iterator",
                              uid: "uid",
                            };

                            onSelectComponentDefinition(definition);
                          }}
                          isSelected={
                            selectedComponentDefinition?.id === "iterator"
                          }
                          definition={{
                            id: "iterator",
                            title: "Iterator",
                            icon: "iterator.svg",
                            name: "iterator/iterator",
                            uid: "uid",
                          }}
                        />
                      ) : null}
                    </CommandGroup>
                  </React.Fragment>
                ) : (
                  <CommandGroup heading="Event">
                    {eventDefinitions.map((definition) => (
                      <CommandItem
                        key={definition.id}
                        onClick={() => {
                          onSelectComponentDefinition(definition);
                        }}
                        definition={definition}
                        isSelected={
                          selectedComponentDefinition?.id === definition.id
                        }
                      />
                    ))}
                  </CommandGroup>
                )}
              </ScrollArea.Root>
            </div>
            <Separator orientation="vertical" className="!mx-3" />
            <div className="w-full h-full relative">
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                {selectedComponentDefinition &&
                isComponentDefinition(selectedComponentDefinition) ? (
                  <ScrollArea.Root className="flex shrink-0 mb-auto h-full">
                    {selectingComponentType === "component"
                      ? selectedComponentDefinition.tasks.map((task) => (
                          <TaskItem
                            docUrl={generateDocUrl(
                              selectedComponentDefinition.documentationUrl,
                              task.name,
                            )}
                            key={task.name}
                            taskTitle={task.title}
                            taskDescription={task.description}
                            onClick={() => {
                              setSelectedTaskName(task.name);
                              onSelectTask(task.name);
                            }}
                            isSelected={selectedTaskName === task.name}
                          />
                        ))
                      : selectedComponentDefinition.spec.eventSpecifications
                        ? Object.entries(
                            selectedComponentDefinition.spec
                              .eventSpecifications,
                          ).map(([key, value]) => (
                            <TaskItem
                              docUrl={generateDocUrl(
                                selectedComponentDefinition.documentationUrl,
                                key,
                              )}
                              key={key}
                              taskTitle={value.title}
                              taskDescription={value.description}
                              onClick={() => {
                                setSelectedTaskName(key);
                                onSelectTask(key);
                              }}
                              isSelected={key === selectedTaskName}
                            />
                          ))
                        : null}
                  </ScrollArea.Root>
                ) : null}
              </div>
              <div
                className="w-full h-8 absolute bottom-0 left-0"
                style={{
                  background:
                    "linear-gradient(0deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%)",
                }}
              ></div>
              <Button
                onClick={onAddComponent}
                className="absolute bottom-0 right-0"
                variant="primary"
                size="md"
              >
                Add
              </Button>
            </div>
            {/* 
              This is the preview of the component recipe, we might need to refactor it later
            */}
            {/* <div className="flex flex-col w-[275px] h-[300px] gap-y-2">
              <div className="w-full p-5 flex-1 rounded-sm bg-semantic-bg-base-bg border border-semantic-bg-line">
                <div className="flex flex-col">
                  <p className="product-label-label-2 text-semantic-fg-disabled">
                    PREVIEW
                  </p>
                  <ScrollArea.Root className="h-[198px]">
                    <SyntaxHighlighter
                      showLineNumbers={false}
                      style={{
                        ...stackoverflowLight,
                        hljs: {
                          display: "block",
                          overflowX: "auto",
                          padding: "0.5em",
                          color: "#2f3337",
                          background: "#F8F9FC",
                          fontSize: "12px",
                        },
                      }}
                      wrapLines={true}
                      wrapLongLines={true}
                    >
                      {selectedComponentDefaultValue || ""}
                    </SyntaxHighlighter>
                  </ScrollArea.Root>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

const CommandGroup = ({
  heading,
  children,
  headingWrapperClassName,
}: {
  heading: string;
  children: React.ReactNode;
  headingWrapperClassName?: string;
}) => {
  return (
    <div className="flex flex-col">
      <div className={cn("w-full py-1 px-4", headingWrapperClassName)}>
        <p className="product-body-text-4-regular text-semantic-fg-disabled">
          {heading}
        </p>
      </div>
      {children}
    </div>
  );
};

const CommandItem = ({
  onClick,
  definition,
  isSelected,
}: {
  onClick: () => void;
  definition: ComponentDefinition | IteratorDefinition;
  isSelected: boolean;
}) => {
  const buttonStyle = React.useMemo(() => {
    if (isSelected) {
      return "bg-semantic-bg-secondary";
    }

    return "hover:bg-semantic-bg-secondary";
  }, [isSelected]);

  return (
    <button
      onClick={onClick}
      key={definition.id}
      value={definition.id}
      className={cn(
        "flex flex-row px-4 py-2 w-full",

        buttonStyle,
      )}
      // keywords={[definition.title, "component"]}
    >
      <div className="flex flex-row gap-x-2 mr-auto">
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
      </div>
      {definition.id !== "iterator" ? (
        <Icons.ChevronRight className="w-4 my-auto h-4 stroke-semantic-fg-primary" />
      ) : null}
    </button>
  );
};

const TaskItem = ({
  taskTitle,
  taskDescription,
  onClick,
  isSelected,
  docUrl,
}: {
  docUrl: string;
  taskTitle: string;
  taskDescription: string;
  onClick: () => void;
  isSelected: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-2 w-full flex flex-col",
        isSelected
          ? "bg-semantic-bg-secondary"
          : "hover:bg-semantic-bg-secondary",
      )}
    >
      <p className="product-body-text-3-medium text-start text-semantic-fg-primary">
        {taskTitle}
      </p>
      <p className="product-body-text-3-regular text-start text-semantic-fg-disabled line-clamp-3">
        {taskDescription}{" "}
        <a
          onClick={(e) => e.stopPropagation()}
          target="_blank"
          rel="noopener noreferrer"
          href={docUrl}
        >
          <Icons.Link01 className="h-3.5 w-3.5 inline-block stroke-semantic-accent-default" />
        </a>
      </p>
    </button>
  );
};
