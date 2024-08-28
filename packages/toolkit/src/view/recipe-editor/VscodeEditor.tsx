"use client";

/**
 * Partial CompletionItems?
 * https://github.com/Microsoft/monaco-editor/issues/379
 *
 * Use storage services to custom intellisense
 * https://stackoverflow.com/questions/54795603/always-show-the-show-more-section-in-monaco-editor
 *
 * 4 Steps to Add Custom Language Support to Monaco Editor
 * https://ohdarling88.medium.com/4-steps-to-add-custom-language-support-to-monaco-editor-5075eafa156d
 *
 * [Part 2] Connect Monaco React Web Editor with Language Server using WebSocket… How hard can it be?
 * https://nipunamarcus.medium.com/part-2-connect-monaco-react-web-editor-with-language-server-using-websocket-how-hard-can-it-be-aa66d93327a6
 */

// To debug suggest-widget, you need to delete all the browser blur event

// suggest-widget
// suggest-details-container
// suggest-details-list
// suggest-details-list-item
import type { Monaco } from "@monaco-editor/react";
import type { editor, IDisposable, languages, Position } from "monaco-editor";
import * as React from "react";
import { Editor } from "@monaco-editor/react";
import { PipelineRecipe } from "instill-sdk";

import { Dialog } from "@instill-ai/design-system";

import { LoadingSpin } from "../../components";
import {
  debounce,
  dot,
  GeneralRecord,
  InstillStore,
  Nullable,
  useInstillStore,
  useNamespacePipeline,
  useNamespaceSecrets,
  useRouteInfo,
  useShallow,
  useUpdateNamespacePipeline,
} from "../../lib";
import { transformInstillJSONSchemaToFormTree } from "../../lib/use-instill-form/transform";
import { transformFormTreeToNestedSmartHints } from "../../lib/use-smart-hint/transformFormTreeToNestedSmartHints";
import { getGeneralComponentInOutputSchema } from "../pipeline-builder";
import { isPipelineGeneralComponent } from "../pipeline-builder/lib/checkComponentType";
import {
  analyzeColonInString,
  keyLineNumberMapHelpers,
  tomorrowTheme,
  validateVSCodeYaml,
} from "./lib";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  updateOpenActionCmdk: store.updateOpenActionCmdk,
  updateEditorRef: store.updateEditorRef,
  updateMonacoRef: store.updateMonacoRef,
  rawRecipeOnDom: store.rawRecipeOnDom,
  updateRawRecipeOnDom: store.updateRawRecipeOnDom,
  updateHasUnsavedRecipe: store.updateHasUnsavedRecipe,
  updateIsSavingRecipe: store.updateIsSavingRecipe,
  currentVersion: store.currentVersion,
});

const availableInstillFormats = [
  "string",
  "array:string",
  "number",
  "array:number",
  "boolean",
  "image/*",
  "array:image/*",
  "audio/*",
  "array:audio/*",
  "video/*",
  "array:video/*",
  "*/*",
  "array:*/*",
  "semi-structured/json",
];

const componentTopLevelKeys = ["type", "input", "setup", "condition", "task"];

export const VscodeEditor = () => {
  const [markErrors, setMarkErrors] = React.useState<editor.IMarkerData[]>([]);

  const autoCompleteDisposableRef = React.useRef<Nullable<IDisposable>>(null);
  const hoverHintDisposableRef = React.useRef<Nullable<IDisposable>>(null);
  const codeLensDisposableRef = React.useRef<Nullable<IDisposable>>(null);
  const editorRef = React.useRef<Nullable<editor.IStandaloneCodeEditor>>(null);
  const monacoRef = React.useRef<Nullable<Monaco>>(null);

  const [openInstillCreditDialog, setOpenInstillCreditDialog] =
    React.useState(false);

  const cachedHoveredHints = React.useRef<Nullable<GeneralRecord>>(null);

  const {
    accessToken,
    enabledQuery,
    updateOpenActionCmdk,
    updateEditorRef,
    updateMonacoRef,
    rawRecipeOnDom,
    updateRawRecipeOnDom,
    updateHasUnsavedRecipe,
    updateIsSavingRecipe,
    currentVersion,
  } = useInstillStore(useShallow(selector));

  const routeInfo = useRouteInfo();
  const namespaceSecrets = useNamespaceSecrets({
    namespaceName: routeInfo.data.namespaceName,
    accessToken,
    enabled: enabledQuery && routeInfo.isSuccess,
  });
  const pipeline = useNamespacePipeline({
    namespacePipelineName: routeInfo.isSuccess
      ? routeInfo.data.pipelineName
      : null,
    accessToken,
    enabled: enabledQuery,
  });

  const updatePipeline = useUpdateNamespacePipeline();
  const recipeUpdater = React.useCallback(
    debounce(
      ({
        pipelineName,
        newRawRecipe,
        accessToken,
      }: {
        pipelineName: Nullable<string>;
        newRawRecipe: string;
        accessToken: Nullable<string>;
      }) => {
        if (!accessToken || !pipelineName) {
          return;
        }

        const res = validateVSCodeYaml(newRawRecipe);

        if (res.success) {
          try {
            updateIsSavingRecipe(() => true);

            updatePipeline.mutateAsync({
              rawRecipe: newRawRecipe,
              namespacePipelineName: pipelineName,
              accessToken,
            });

            // Smooth the indicator transition, if the update goes too fast, the indicator
            // will blink
            setTimeout(() => {
              updateIsSavingRecipe(() => false);
              updateHasUnsavedRecipe(() => false);
            }, 500);
          } catch (error) {
            console.error(error);
          }
        }
      },
      3000,
    ),
    [],
  );

  React.useEffect(() => {
    if (!editorRef.current || !monacoRef.current) {
      return;
    }

    const model = editorRef.current.getModel();

    if (!model) {
      return;
    }

    monacoRef.current.editor.setModelMarkers(model, "owner", markErrors);
  }, [markErrors]);

  // Change editor background color, when the released version is selected
  React.useEffect(() => {
    let newTheme = tomorrowTheme;

    if (currentVersion === "latest") {
      newTheme = {
        ...tomorrowTheme,
        colors: {
          ...tomorrowTheme.colors,
          "editor.background": "#f8f9fc",
        },
      };
    } else {
      newTheme = {
        ...tomorrowTheme,
        colors: {
          ...tomorrowTheme.colors,
          "editor.background": "#e1e6ef",
        },
      };
    }

    monacoRef.current?.editor.defineTheme(
      "tomorrow",
      newTheme as editor.IStandaloneThemeData,
    );
  }, [currentVersion]);

  const handleAutoComplete = React.useCallback(
    ({
      model,
      position,
      monaco,
      recipe,
    }: {
      model: editor.ITextModel;
      position: Position;
      monaco: Nullable<Monaco>;
      recipe: Nullable<PipelineRecipe>;
    }) => {
      const result: languages.CompletionItem[] = [];

      if (!monaco || !recipe) {
        return {
          suggestions: result,
        };
      }

      const last_chars = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: 0,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      });

      const allValue = model.getValue();

      const words = last_chars.replace("\t", "").split(" ");

      // What the user is currently typing (everything after the last space)
      const active_typing = words[words.length - 1];

      if (!active_typing) {
        return {
          suggestions: result,
        };
      }

      const componentKeyLineNumberMaps =
        keyLineNumberMapHelpers.getAllComponentKeyLineNumberMaps(allValue);

      const smallestComponentKeyLineNumberMap = componentKeyLineNumberMaps
        .reverse()
        .find((map) => map.lineNumber <= position.lineNumber);

      if (
        smallestComponentKeyLineNumberMap &&
        pipeline.isSuccess &&
        pipeline.data.recipe.component
      ) {
        // [HINT task]
        // We need to hint task type for every component.
        // 1. We need to find the component that the user is typing in. -> Check the closest and smallest component key line number.
        // 2. We need to find the task type for the component.
        if (last_chars.includes("task:")) {
          const targetComponent =
            pipeline.data.recipe.component[
              smallestComponentKeyLineNumberMap.key
            ];

          if (targetComponent && isPipelineGeneralComponent(targetComponent)) {
            for (const task of targetComponent.definition?.tasks ?? []) {
              result.push({
                label: task.name,
                kind: monaco.languages.CompletionItemKind.Field,
                insertText: task.name,
                filterText: task.name,
                range: new monaco.Range(
                  position.lineNumber,
                  position.column - active_typing.length,
                  position.lineNumber,
                  position.column,
                ),
                documentation: {
                  value: `**${task.name}** \n\n ${task.title} \n\n --- \n\n ${task.description}`,
                  isTrusted: true,
                },
              });
            }

            return {
              suggestions: result,
            };
          }
        }

        // We need to hint component type for every component
        // if (last_chars.includes("type:")) {
        // }
      }

      const topLevelKeyLineNumberMaps =
        keyLineNumberMapHelpers.getRecipeTopLevelKeyLineNumberMaps(allValue);

      const smallestTopLevelKeyLineNumberMap = topLevelKeyLineNumberMaps
        .reverse()
        .find((map) => map.lineNumber <= position.lineNumber);

      const componentTopLevelKeyLineNumberMaps =
        smallestComponentKeyLineNumberMap
          ? keyLineNumberMapHelpers.getComponentTopLevelKeyLineNumberMaps(
              allValue,
              smallestComponentKeyLineNumberMap.key,
            )
          : undefined;

      const smallestComponentTopLevelKeyLineNumberMap =
        componentTopLevelKeyLineNumberMaps
          ?.reverse()
          .find((map) => map.lineNumber <= position.lineNumber);

      // [HINT Component Input key value]
      if (
        smallestComponentKeyLineNumberMap &&
        smallestComponentTopLevelKeyLineNumberMap &&
        smallestComponentTopLevelKeyLineNumberMap.key === "input"
      ) {
        const { substringBeforeColon } = analyzeColonInString(
          last_chars,
          position.column,
        );

        const componenetKey = smallestComponentKeyLineNumberMap.key;
        const targetComponent = pipeline.data?.recipe.component
          ? pipeline.data.recipe.component[componenetKey]
          : undefined;

        if (
          targetComponent &&
          isPipelineGeneralComponent(targetComponent) &&
          targetComponent.definition
        ) {
          const targetTaskDefinition =
            targetComponent.definition.spec.componentSpecification.oneOf?.find(
              (oneOf) => oneOf.properties?.task?.const === targetComponent.task,
            );

          if (targetTaskDefinition) {
            const formTree =
              transformInstillJSONSchemaToFormTree(targetTaskDefinition);

            if (formTree._type === "formGroup") {
              const inputProperties = formTree.properties.find(
                (e) => e.path === "input",
              );

              if (inputProperties && inputProperties._type === "formGroup") {
                const targetProperty = inputProperties.properties.find(
                  (e) => e.fieldKey === substringBeforeColon,
                );

                if (
                  targetProperty &&
                  targetProperty._type === "formItem" &&
                  targetProperty.enum
                ) {
                  for (const enumValue of targetProperty.enum) {
                    result.push({
                      label: enumValue,
                      kind: monaco.languages.CompletionItemKind.Field,
                      insertText: enumValue,
                      filterText: enumValue,
                      range: new monaco.Range(
                        position.lineNumber,
                        position.column - active_typing.length,
                        position.lineNumber,
                        position.column,
                      ),
                    });
                  }

                  return {
                    suggestions: result,
                  };
                }
              }
            }
          }
        }
      }

      // [HINT variable.instill-format]
      // We need to hint instill-format for variables
      if (
        smallestTopLevelKeyLineNumberMap &&
        smallestTopLevelKeyLineNumberMap.key === "variable" &&
        last_chars.includes("instill-format:")
      ) {
        for (const format of availableInstillFormats) {
          result.push({
            label: format,
            kind: monaco.languages.CompletionItemKind.Field,
            insertText: `"${format}"`,
            filterText: format,
            range: new monaco.Range(
              position.lineNumber,
              position.column - active_typing.length,
              position.lineNumber,
              position.column,
            ),
          });
        }

        return {
          suggestions: result,
        };
      }

      const component = recipe?.component;

      if (!component) {
        return {
          suggestions: result,
        };
      }

      // If the last character typed is a period then we need to look at member objects of the obj object
      const isMember = active_typing.charAt(active_typing.length - 1) == ".";

      // If the user is typing a member object
      // For example: when user type ${o we first need to hint them the available components id
      if (isMember) {
        // [HINT secret]
        // We need to hint secret for component setup
        if (
          active_typing.includes("secret") &&
          namespaceSecrets.isSuccess &&
          smallestComponentTopLevelKeyLineNumberMap &&
          smallestComponentTopLevelKeyLineNumberMap.key === "setup"
        ) {
          for (const secret of namespaceSecrets.data) {
            result.push({
              label: secret.id,
              kind: monaco.languages.CompletionItemKind.Field,
              insertText: "${" + "secret." + secret.id,
              filterText: "${" + "secret." + secret.id,
              range: new monaco.Range(
                position.lineNumber,
                position.column - active_typing.length,
                position.lineNumber,
                position.column,
              ),
              detail: secret.description ?? undefined,
              documentation: {
                value: `**${secret.id}** \n\n --- \n\n ${secret.description}`,
              },
            });
          }

          return {
            suggestions: result,
          };
        }

        // [HINT reference to variable]
        if (active_typing.includes("variable") && recipe.variable) {
          const allHints = recipe.variable;

          for (const [key, value] of Object.entries(allHints)) {
            result.push({
              label: key,
              kind: monaco.languages.CompletionItemKind.Field,
              insertText: "${" + "variable." + key,
              filterText: "${" + "variable." + key,
              documentation: {
                value: `**${key}** \n\n --- \n\n instill-format: ${value.instillFormat}`,
              },
              range: new monaco.Range(
                position.lineNumber,
                position.column - active_typing.length,
                position.lineNumber,
                position.column,
              ),
              detail: `${value.instillFormat}`,
            });
          }

          return {
            suggestions: result,
          };
        }

        const allHints: GeneralRecord = {};

        for (const [key, value] of Object.entries(component)) {
          if (isPipelineGeneralComponent(value)) {
            const { outputSchema } = getGeneralComponentInOutputSchema(value);

            if (outputSchema) {
              const outputFormTree =
                transformInstillJSONSchemaToFormTree(outputSchema);

              const hints = transformFormTreeToNestedSmartHints(outputFormTree);

              allHints[key] = {
                output: hints,
              };
            }
          }
        }

        // [HINT component output]
        // Is a member, get a list of all members, and the prefix
        const objPath = active_typing
          .substring(0, active_typing.length - 1)
          .replaceAll("${", "")
          .replaceAll("}", "");
        const regex = /\[(\d+)\]/g;
        // const matches = objPath.match(regex);
        const objPathWoIndex = objPath.replaceAll(regex, "");

        const hint = dot.getter(allHints, objPathWoIndex) as GeneralRecord;

        if (hint.type === "objectArray") {
          const regex = /\[(\d+)\]/g;
          const matches = objPath.match(regex);

          if (matches && matches[0]) {
            const arrayHint = dot.getter(
              allHints,
              objPathWoIndex,
            ) as GeneralRecord;

            for (const [key, value] of Object.entries(arrayHint)) {
              result.push({
                label: key,
                kind: monaco.languages.CompletionItemKind.Field,
                insertText: "${" + objPath + "." + key,
                filterText: "${" + objPath + "." + key,
                documentation: {
                  value: `**${key}** \n\n ${value.instillFormat} \n\n --- \n\n ${value.description}`,
                },
                range: new monaco.Range(
                  position.lineNumber,
                  position.column - active_typing.length,
                  position.lineNumber,
                  position.column,
                ),
              });
            }
          }

          return {
            suggestions: result,
          };
        }

        for (const [key, value] of Object.entries(hint)) {
          if (typeof value !== "object") {
            continue;
          }

          result.push({
            label: key,
            kind: monaco.languages.CompletionItemKind.Field,
            insertText: "${" + objPath + "." + key,
            filterText: "${" + objPath + "." + key,
            documentation: {
              value: `**${key}** \n\n ${value.instillFormat} \n\n --- \n\n ${value.description}`,
            },
            range: new monaco.Range(
              position.lineNumber,
              position.column - active_typing.length,
              position.lineNumber,
              position.column,
            ),
          });
        }

        return {
          suggestions: result,
        };
      }

      const referenceRegex = /\${/g;
      const isReference = referenceRegex.test(active_typing);

      // [HINT component key]
      if (isReference) {
        const componentKeys: string[] = [];
        for (const [key, value] of Object.entries(component)) {
          if (isPipelineGeneralComponent(value)) {
            componentKeys.push(key);
          }
        }

        for (const [key, value] of Object.entries(component)) {
          if (isPipelineGeneralComponent(value)) {
            result.push({
              label: key,
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: "${" + key,
              filterText: "${" + key,
              documentation: {
                value: `**${key}** \n\n --- \n\n Component type: ${value.definition?.id}`,
                isTrusted: true,
              },
              range: new monaco.Range(
                position.lineNumber,
                position.column - active_typing.length,
                position.lineNumber,
                position.column,
              ),
            });
          }
        }

        if (recipe.variable) {
          result.push({
            label: "variable",
            kind: monaco.languages.CompletionItemKind.Variable,
            insertText: "${" + "variable",
            filterText: "${" + "variable",
            range: new monaco.Range(
              position.lineNumber,
              position.column - active_typing.length,
              position.lineNumber,
              position.column,
            ),
          });
        }

        // [HINT secret key]
        // This keyword will only be used under setup component toplevel key
        if (
          smallestComponentTopLevelKeyLineNumberMap &&
          smallestComponentTopLevelKeyLineNumberMap.key === "setup"
        ) {
          result.push({
            label: "secret",
            kind: monaco.languages.CompletionItemKind.Variable,
            insertText: "${" + "secret",
            filterText: "${" + "secret",
            documentation: {
              value: "Instill Secret",
            },
            range: new monaco.Range(
              position.lineNumber,
              position.column - active_typing.length,
              position.lineNumber,
              position.column,
            ),
          });
        }

        return {
          suggestions: result,
        };
      }
    },
    [
      namespaceSecrets.isSuccess,
      namespaceSecrets.data,
      pipeline.isSuccess,
      pipeline.data,
    ],
  );

  const handleHoverHint = React.useCallback(
    ({
      model,
      position,
      monaco,
    }: {
      model: editor.ITextModel;
      position: Position;
      monaco: Nullable<Monaco>;
    }) => {
      if (!pipeline.isSuccess || !monaco) {
        return;
      }

      const content = model.getValue();

      const givenLineContent = model.getLineContent(position.lineNumber);

      try {
        const { isBeforeColon, substringBeforeColon } = analyzeColonInString(
          givenLineContent,
          position.column,
        );

        // The hover hint now only work for the key not the value
        if (!isBeforeColon) {
          return null;
        }

        // We need to hint user what is the component top level keys
        if (componentTopLevelKeys.includes(substringBeforeColon)) {
          return null;
        }

        const componentKeyLineNumberMaps =
          keyLineNumberMapHelpers.getAllComponentKeyLineNumberMaps(content);

        const smallestComponentKeyLineNumberMap = componentKeyLineNumberMaps
          .reverse()
          .find((map) => map.lineNumber <= position.lineNumber);

        if (!smallestComponentKeyLineNumberMap) {
          return null;
        }

        const componentTopLevelKeyLineNumberMaps =
          keyLineNumberMapHelpers.getComponentTopLevelKeyLineNumberMaps(
            content,
            smallestComponentKeyLineNumberMap.key,
          );

        const smallestComponentTopLevelKeyLineNumberMap =
          componentTopLevelKeyLineNumberMaps
            .reverse()
            .find((map) => map.lineNumber <= position.lineNumber);

        if (!smallestComponentTopLevelKeyLineNumberMap) {
          return null;
        }

        const hoveredKeyDotPath = `${smallestComponentTopLevelKeyLineNumberMap.dotPath}.${substringBeforeColon}`;

        if (cachedHoveredHints.current) {
          const targetHint = cachedHoveredHints.current[hoveredKeyDotPath];
          if (targetHint) {
            return {
              range: new monaco.Range(
                position.lineNumber,
                position.column,
                position.lineNumber,
                position.column,
              ),
              contents: [
                { value: `## ${targetHint.key}` },
                {
                  value: targetHint.description,
                },
              ],
            };
          }
        }

        const targetComponent = pipeline.data.recipe.component
          ? pipeline.data.recipe.component[
              smallestComponentKeyLineNumberMap.key
            ]
          : null;

        if (
          !targetComponent ||
          !isPipelineGeneralComponent(targetComponent) ||
          !targetComponent.definition?.spec.componentSpecification
        ) {
          return null;
        }

        const targetTaskDefinition =
          targetComponent.definition.spec.componentSpecification.oneOf?.find(
            (oneOf) => oneOf.properties?.task?.const === targetComponent.task,
          );

        if (!targetTaskDefinition) {
          return null;
        }

        const formTree =
          transformInstillJSONSchemaToFormTree(targetTaskDefinition);

        const nestedHints = transformFormTreeToNestedSmartHints(formTree);

        const hoveredKeyPathWoComponentKey = `${smallestComponentTopLevelKeyLineNumberMap.key}.${substringBeforeColon}`;

        const targetHint = dot.getter(
          nestedHints,
          hoveredKeyPathWoComponentKey,
        );

        if (targetHint) {
          if (cachedHoveredHints.current) {
            cachedHoveredHints.current = {
              ...cachedHoveredHints.current,
              [hoveredKeyDotPath]: targetHint,
            };
          } else {
            cachedHoveredHints.current = {
              [hoveredKeyDotPath]: targetHint,
            };
          }

          return {
            range: new monaco.Range(
              position.lineNumber,
              position.column,
              position.lineNumber,
              position.column,
            ),
            contents: [
              { value: `## ${targetHint.key}` },
              {
                value: targetHint.description,
              },
            ],
          };
        }
      } catch (error) {
        console.log(error);
      }

      return null;

      // return {
      //   range: new monaco.Range(
      //     1,
      //     1,
      //     model.getLineCount(),
      //     model.getLineMaxColumn(model.getLineCount()),
      //   ),
      //   contents: [
      //     { value: "**SOURCE**" },
      //     {
      //       value: "```html\n",
      //     },
      //   ],
      // };
    },
    [pipeline.isSuccess, pipeline.data],
  );

  const handleCodeLens = React.useCallback(
    ({
      model,
      monaco,
      commandId,
    }: {
      model: editor.ITextModel;
      monaco: Nullable<Monaco>;
      commandId: Nullable<string>;
    }) => {
      if (!monaco || !commandId || !model) {
        return;
      }

      return null;

      // The codelens will be used on integration warning in the future
      // const codeLenses: languages.CodeLens[] = [];
      // const currentEditorValue = model.getValue();

      // const lineCounter = new YAML.LineCounter();
      // const yamlData = YAML.parse(currentEditorValue);
      // const doc = YAML.parseAllDocuments<YAML.YAMLMap>(currentEditorValue, {
      //   lineCounter,
      // });

      // if (!yamlData || !doc || !doc[0]) {
      //   return null;
      // }

      // const yamlComponent = yamlData?.component as GeneralRecord | undefined;

      // if (!yamlComponent) {
      //   return null;
      // }

      // for (const [key, value] of Object.entries(yamlComponent)) {
      //   if (!value) {
      //     continue;
      //   }

      //   if (isPipelineGeneralComponent(value)) {
      //     if (value.setup) {
      //       const apiKey = value.setup["api-key"];
      //       if (apiKey && apiKey.includes("secret.INSTILL_CREDIT")) {
      //         const node = doc[0].getIn(["component", key], true) as YAML.Node;

      //         if (node && node.range) {
      //           const pos = lineCounter.linePos(node.range[0]);
      //           const adjustedLine =
      //             node instanceof YAML.Scalar ? pos.col : pos.line - 1;
      //           codeLenses.push({
      //             range: new monaco.Range(
      //               adjustedLine - 1,
      //               pos.col,
      //               adjustedLine - 1,
      //               pos.col,
      //             ),
      //             id: key,
      //             command: {
      //               id: commandId,
      //               title: `Component ${key} is using Instill Credit`,
      //               tooltip: "",
      //             },
      //           });
      //         }
      //       }
      //     }
      //   }
      // }

      // return {
      //   lenses: codeLenses,
      //   dispose: () => {
      //     console.log("Disposing code lenses");
      //   },
      // };
    },
    [],
  );

  // When the pipeline is updated, we need to re-register the services we used
  // in the monaco editor
  React.useEffect(() => {
    if (!monacoRef.current || !pipeline.isSuccess) {
      return;
    }

    if (autoCompleteDisposableRef.current) {
      autoCompleteDisposableRef.current.dispose();
    }

    if (hoverHintDisposableRef.current) {
      hoverHintDisposableRef.current.dispose();
    }

    const autoCompleteDisposable =
      monacoRef.current.languages.registerCompletionItemProvider("yaml", {
        triggerCharacters: ["${", "."],
        provideCompletionItems: (model, position) => {
          return handleAutoComplete({
            model,
            position,
            monaco: monacoRef.current,
            recipe: pipeline.data.recipe,
          });
        },
      });
    autoCompleteDisposableRef.current = autoCompleteDisposable;

    const hoverHintDisposable =
      monacoRef.current.languages.registerHoverProvider("yaml", {
        provideHover: (model, position) => {
          return handleHoverHint({
            model,
            position,
            monaco: monacoRef.current,
          });
        },
      });
    hoverHintDisposableRef.current = hoverHintDisposable;
  }, [pipeline.data, pipeline.isSuccess, handleAutoComplete, handleHoverHint]);

  return (
    <div className="w-full h-full relative">
      {/* {pipeline.isSuccess && currentVersion !== "latest" ? (
        <div className="absolute z-10 inset-0 bg-semantic-fg-primary opacity-15"></div>
      ) : null} */}
      <style jsx={true}>{`
        ..rendered-markdown > h1 {
          font-size: 1.5rem;
          font-weight: 600;
        }

        .rendered-markdown > h2 {
          font-size: 1.2rem;
          font-weight: 600;
        }

        .rendered-markdown > hr {
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .codelens-decoration > a {
          font-size: 1rem;
          font-weight: 400;
        }

        .editor-widget {
          border: 1px solid #bfbfbf !important;
          background-color: #f0f0f0 !important;
        }

        .monaco-hover-content {
          background-color: #ffffff !important;
          border: 1px solid #e1e6ef !important;
        }
      `}</style>
      <Editor
        language="yaml"
        className="rounded-b"
        loading={
          <div className="w-10 h-10 flex items-center justify-center">
            <LoadingSpin className="!text-semantic-fg-primary" />
          </div>
        }
        onChange={(value) => {
          if (!value || !pipeline.isSuccess) {
            return;
          }

          updateHasUnsavedRecipe(() => true);

          // In the updater we will check whether the value is valid or not again, the reason
          // why we do this duplicated check is due to we want to invoke the updater function
          // every time the user type something, so it didn't send the wrong value to the backend

          // For example, if we only invoke updater only when the recipe is valid, once the user
          // type something wrong, then the updater will send the last valid value to the backend
          // and overwrite the value that the user is typing.

          recipeUpdater({
            pipelineName: pipeline.data.name,
            newRawRecipe: value,
            accessToken,
          });

          updateRawRecipeOnDom(() => value);

          const res = validateVSCodeYaml(value);

          if (res.success) {
            setMarkErrors([]);
          } else {
            updateRawRecipeOnDom(() => value);
            setMarkErrors(res.markers);
          }
        }}
        theme="tomorrow"
        value={rawRecipeOnDom ?? ""}
        options={{
          minimap: {
            enabled: false,
          },
          tabSize: 2,
          automaticLayout: true,
          quickSuggestions: {
            other: true,
            comments: false,
            strings: true,
          },
          suggest: {
            showSnippets: true,
          },
          fontSize: 18,
          readOnly: currentVersion !== "latest",
          readOnlyMessage: {
            value:
              "You are viewing a past version of this pipeline, which is not editable.",
          },
        }}
        onMount={(editor, monaco) => {
          editorRef.current = editor;
          updateEditorRef(() => editor);
          monacoRef.current = monaco;
          updateMonacoRef(() => monaco);
          const autoCompleteDisposable =
            monaco.languages.registerCompletionItemProvider("yaml", {
              triggerCharacters: ["${", "."],
              provideCompletionItems: (model, position) => {
                // Split everything the user has typed on the current line up at each space, and only look at the last word
                return handleAutoComplete({
                  model,
                  position,
                  monaco,
                  recipe: pipeline.data?.recipe ?? null,
                });
              },
            });
          autoCompleteDisposableRef.current = autoCompleteDisposable;

          monaco.editor.defineTheme(
            "tomorrow",
            tomorrowTheme as editor.IStandaloneThemeData,
          );

          const hoverHintDisposable = monaco.languages.registerHoverProvider(
            "yaml",
            {
              provideHover: (model, position) => {
                return handleHoverHint({ model, position, monaco });
              },
            },
          );
          hoverHintDisposableRef.current = hoverHintDisposable;

          const openInstillCreditDialogCommand = editor.addCommand(0, () => {
            setOpenInstillCreditDialog(() => true);
          });

          const codeLensDisposable = monaco.languages.registerCodeLensProvider(
            "yaml",
            {
              provideCodeLenses: (model) => {
                return handleCodeLens({
                  model,
                  monaco,
                  commandId: openInstillCreditDialogCommand,
                });
              },
            },
          );
          codeLensDisposableRef.current = codeLensDisposable;

          editor.addAction({
            id: "open-cmdk",
            label: "Open Cmdk",
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK],
            contextMenuOrder: 1,
            run: () => {
              updateOpenActionCmdk(() => true);
            },
          });
        }}
      />
      <Dialog.Root
        open={openInstillCreditDialog}
        onOpenChange={(open) => setOpenInstillCreditDialog(open)}
      >
        <Dialog.Content className="!h-[475px] !max-w-[560px]">
          <div className="flex flex-col gap-y-2">
            <h2 className="product-headings-heading-2">Instill Credit</h2>
            <p className="product-body-text-3-medium">
              The purpose of Instill Credit is easing the adoption of ☁️ Instill
              Cloud, minimizing the time required to build and set up a
              pipeline. After setting up your account, you&apos;ll get 10,000
              monthly credits for free, which can be spent on the following
              actions:
            </p>
            <ul className="list-disc list-outside ml-4">
              <li className="product-body-text-3-regular">
                Run your own pipelines, or any public pipeline available on
                Explore.
              </li>
              <li className="product-body-text-3-regular">
                Execute pre-configured AI components without needing to create
                accounts or API keys on 3rd party services.
              </li>
            </ul>
          </div>
          <Dialog.Close />
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
};
