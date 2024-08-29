"use client";

import * as React from "react";
import { ComponentDefinition, IteratorDefinition } from "instill-sdk";
import { editor } from "monaco-editor";
// import { Range } from "monaco-editor";
import SyntaxHighlighter from "react-syntax-highlighter";
import { stackoverflowLight } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import YAML from "yaml";

import {
  Button,
  cn,
  Dialog,
  Icons,
  ScrollArea,
  Separator,
} from "@instill-ai/design-system";

import { ImageWithFallback, LoadingSpin } from "../../../components";
import {
  InstillJSONSchema,
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
import { keyLineNumberMapHelpers } from "../lib";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  openComponentCmdo: store.openComponentCmdo,
  updateOpenComponentCmdo: store.updateOpenComponentCmdo,
  editorRef: store.editorRef,
  monacoRef: store.monacoRef,
});

function generateDefaultValue(schema: InstillJSONSchema, taskName?: string) {
  const formTree = transformInstillJSONSchemaToFormTree(schema);

  const selectedConditionMap =
    transformInstillFormTreeToInitialSelectedCondition(formTree, {
      initialData: taskName
        ? {
            task: taskName,
          }
        : undefined,
    });

  const data = transformInstillFormTreeToDefaultValue(formTree, {
    selectedConditionMap,
    skipPath: ["setup.api-key"],
  });

  return data;
}

export const ComponentCmdo = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const routeInfo = useRouteInfo();
  const {
    accessToken,
    enabledQuery,
    openComponentCmdo,
    updateOpenComponentCmdo,
    editorRef,
    monacoRef,
  } = useInstillStore(useShallow(selector));

  const [searchCode, setSearchCode] = React.useState<Nullable<string>>(null);

  const [selectedComponentDefinition, setSelectedComponentDefinition] =
    React.useState<Nullable<ComponentDefinition | IteratorDefinition>>(null);
  const [selectedTask, setSelectedTask] =
    React.useState<Nullable<string>>(null);
  const [selectedComponentDefaultValue, setSelectedComponentDefaultValue] =
    React.useState<Nullable<string>>(null);

  const pipeline = useNamespacePipeline({
    namespacePipelineName: routeInfo.isSuccess
      ? routeInfo.data.pipelineName
      : null,
    accessToken,
    enabled: enabledQuery,
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

  // Set the default selected component definition
  React.useEffect(() => {
    if (
      filteredDefinitions.length === 0 ||
      selectedComponentDefinition ||
      !filteredDefinitions[0]
    ) {
      return;
    }

    const defaultSelectedComponentDefinition = filteredDefinitions[0];

    setSelectedComponentDefinition(defaultSelectedComponentDefinition);
  }, [filteredDefinitions, selectedComponentDefinition]);

  // Set the default selected task
  React.useEffect(() => {
    if (
      !selectedComponentDefinition ||
      !pipeline.isSuccess ||
      !isComponentDefinition(selectedComponentDefinition)
    ) {
      return;
    }

    const defaultSelectedTask = selectedComponentDefinition.tasks[0]
      ? selectedComponentDefinition.tasks[0].name
      : undefined;

    const componentIds = pipeline.data.recipe?.component
      ? Object.keys(pipeline.data.recipe.component)
      : [];

    if (isComponentDefinition(selectedComponentDefinition)) {
      const id = generateUniqueNodeIdFromDefinition(
        selectedComponentDefinition,
        componentIds,
      );

      const defaultValue = generateDefaultValue(
        selectedComponentDefinition.spec.componentSpecification,
        defaultSelectedTask,
      );

      const doc = YAML.stringify({
        [id]: {
          type: selectedComponentDefinition.id,
          ...defaultValue,
        },
      });
      setSelectedComponentDefaultValue(doc);
    }
    setSelectedTask(defaultSelectedTask ?? null);
  }, [selectedComponentDefinition, pipeline.isSuccess, pipeline.data]);

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

  function onSelectTask() {
    if (
      !pipeline.isSuccess ||
      !editorRef ||
      !selectedComponentDefinition ||
      !selectedTask
    ) {
      return;
    }

    const stringfyOptions: YAML.ToStringOptions = {
      indent: 2,
    };

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
      const id = generateUniqueNodeIdFromDefinition(
        selectedComponentDefinition,
        componentIds,
      );
      const defaultValue = generateDefaultValue(
        selectedComponentDefinition.spec.componentSpecification,
        selectedTask,
      );

      doc = YAML.stringify(
        {
          [id]: {
            type: selectedComponentDefinition.id,
            ...defaultValue,
          },
        },
        stringfyOptions,
      );
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

    // const lines = selectedComponentDefaultValue.split("\n");

    const yamlLines = selectedComponentDefaultValue.split("\n");
    const edits: editor.IIdentifiedSingleEditOperation[] = [];

    // get the line number of the current model
    const lineCount = editorRef.getModel()?.getLineCount();

    const allValue = editorRef.getModel()?.getValue();

    if (!allValue) {
      return;
    }

    let dontHaveComponentAfterSelection = false;

    try {
      const componentKeyLineNumberMaps =
        keyLineNumberMapHelpers.getAllComponentKeyLineNumberMaps(allValue);

      const biggestKeyLineNumber = componentKeyLineNumberMaps
        .map((map) => map.lineNumber)
        .sort((a, b) => b - a)[0];

      if (
        biggestKeyLineNumber &&
        selection.selectionStartLineNumber > biggestKeyLineNumber
      ) {
        dontHaveComponentAfterSelection = true;
      }

      // This is a safe guard, for example, when user have a very long component configuration, but
      // one of the component's indent is not correct, the getAllComponentKeyLineNumberMaps will
      // not get the full list of component key line number maps. In this case we will fall back
      if (lineCount && selection.selectionStartLineNumber < lineCount - 10) {
        dontHaveComponentAfterSelection = false;
      }
    } catch (error) {
      console.log(error);
    }

    if (!dontHaveComponentAfterSelection) {
      edits.push(
        ...[
          {
            range: new monacoRef.Range(
              selection.selectionStartLineNumber,
              4,
              selection.endLineNumber,
              4,
            ),
            text: "  ",
            forceMoveMarkers: true,
          },
          {
            range: new monacoRef.Range(
              selection.selectionStartLineNumber,
              4,
              selection.endLineNumber,
              4,
            ),
            text: selectedComponentDefaultValue,
            forceMoveMarkers: true,
          },
        ],
      );
    } else {
      yamlLines.forEach((line, index) => {
        edits.push(
          ...[
            {
              range: new monacoRef.Range(
                selection.selectionStartLineNumber + index,
                4,
                selection.endLineNumber + index,
                4,
              ),
              text: "  ",
              forceMoveMarkers: true,
            },
            {
              range: new monacoRef.Range(
                selection.selectionStartLineNumber + index,
                4,
                selection.endLineNumber + index,
                4,
              ),
              text: line + "\n",
              forceMoveMarkers: true,
            },
          ],
        );
      });
    }

    editorRef.executeEdits("cmdk", edits);

    // editorRef.trigger("keyboard", "type", "hello");
    // editorRef.trigger("anyString", "editor.action.formatDocument", "");

    // We need this setTimeout to correctly focus the editor after the edit
    setTimeout(() => {
      editorRef.focus();
      updateOpenComponentCmdo(() => false);
    }, 100);
  }

  return (
    <Dialog.Root
      open={openComponentCmdo}
      onOpenChange={(open) => {
        if (!open) {
          setSelectedComponentDefinition(null);
          setSelectedTask(null);
          setSelectedComponentDefaultValue(null);
        }

        updateOpenComponentCmdo(() => open);
      }}
    >
      <Dialog.Trigger asChild>
        <EditorButtonTooltipWrapper tooltipContent="⌘ O">
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
        <div className="flex w-full flex-col h-full overflow-y-hidden">
          <div className="flex flex-row mb-6">
            <div className="flex flex-col gap-y-2 mr-auto">
              <h3 className="text-semantic-fg-primary product-headings-heading-3">
                Add Component
              </h3>
              <p className="product-body-text-2-regular text-semantic-fg-secondary">
                Select a component and add it to your pipeline
              </p>
            </div>
            <button
              onClick={() => {
                updateOpenComponentCmdo(() => false);
              }}
              className="p-3 my-auto border border-semantic-bg-line bg-semantic-bg-primary shadow rounded-[10px] hover:bg-semantic-bg-base-bg"
            >
              <Icons.X className="w-6 h-6 stroke-semantic-fg-primary" />
            </button>
          </div>
          <div className="w-full mb-3 relative">
            <Icons.SearchSm className="w-4 h-4 absolute top-1/2 -translate-y-1/2 left-[9px] stroke-semantic-fg-primary" />
            <input
              ref={inputRef}
              placeholder="Search component..."
              onChange={(e) => setSearchCode(e.target.value)}
              className="border w-full pl-[33px] pr-[9px] py-1.5 rounded border-semantic-bg-line"
            />
          </div>
          <div className="flex flex-row w-full h-full">
            <ScrollArea.Root className="flex py-3 shrink-0 w-[240px] h-[300px]">
              <CommandGroup heading="AI">
                {definitions.isSuccess ? (
                  filteredAiDefinitions.map((definition) => (
                    <CommandItem
                      key={definition.id}
                      onClick={() => {
                        setSelectedComponentDefinition(definition);
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
                        setSelectedComponentDefinition(definition);
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
                        setSelectedComponentDefinition(definition);
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
                        setSelectedComponentDefinition(definition);
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
                        setSelectedComponentDefinition(definition);
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

                    setSelectedComponentDefinition(definition);

                    const componentIds = pipeline.data.recipe?.component
                      ? Object.keys(pipeline.data.recipe.component)
                      : [];

                    const id = generateUniqueNodeIdFromDefinition(
                      definition,
                      componentIds,
                    );

                    const doc = YAML.stringify({
                      [id]: {
                        type: "iterator",
                        component: "\n",
                      },
                    });

                    setSelectedTask("iterator");

                    setSelectedComponentDefaultValue(doc);
                  }}
                  isSelected={selectedComponentDefinition?.id === "iterator"}
                  definition={{
                    id: "iterator",
                    title: "Iterator",
                    icon: "iterator.svg",
                    name: "iterator/iterator",
                    uid: "uid",
                  }}
                />
              </CommandGroup>
            </ScrollArea.Root>
            <Separator orientation="vertical" className="!mx-3" />
            {selectedComponentDefinition &&
            isComponentDefinition(selectedComponentDefinition) ? (
              <div className="w-[160px] py-3 shrink-0 mr-3">
                <ScrollArea.Root className="flex w-full h-[306px]">
                  <CommandGroup headingWrapperClassName="px-2" heading="Task">
                    {selectedComponentDefinition.tasks.map((task) => (
                      <TaskItem
                        key={task.name}
                        taskTitle={task.title}
                        onClick={() => {
                          setSelectedTask(task.name);
                          onSelectTask();
                        }}
                        isSelected={selectedTask === task.name}
                      />
                    ))}
                  </CommandGroup>
                </ScrollArea.Root>
              </div>
            ) : null}
            <div className="flex flex-col w-[275px] h-[300px] gap-y-2">
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
              <Button
                onClick={onAddComponent}
                className="ml-auto"
                variant="primary"
                size="md"
              >
                Add
              </Button>
            </div>
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
  onClick,
  isSelected,
}: {
  taskTitle: string;
  onClick: () => void;
  isSelected: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-2 w-full",
        isSelected
          ? "bg-semantic-bg-secondary"
          : "hover:bg-semantic-bg-secondary",
      )}
    >
      <p className="product-body-text-3-medium text-start text-semantic-fg-primary">
        {taskTitle}
      </p>
    </button>
  );
};
