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

// suggest-widget
// suggest-details-container
// suggest-details-list
// suggest-details-list-item
import type { Monaco } from "@monaco-editor/react";
import type { editor, IDisposable, languages, Position } from "monaco-editor";
import * as React from "react";
import { Editor } from "@monaco-editor/react";
import { PipelineRecipe } from "instill-sdk";

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
import { keyLineNumberMapHelpers } from "./keyLineNumberMapHelpers";
import { validateVSCodeYaml } from "./validateVSCodeYaml";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  updateOpenCmdk: store.updateOpenCmdk,
  updateEditorRef: store.updateEditorRef,
  updateMonacoRef: store.updateMonacoRef,
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

export const VscodeEditor = () => {
  const [markErrors, setMarkErrors] = React.useState<editor.IMarkerData[]>([]);
  const [unsavedRawRecipe, setUnsavedRawRecipe] =
    React.useState<Nullable<string>>(null);

  const autoCompleteDisposableRef = React.useRef<Nullable<IDisposable>>(null);
  const editorRef = React.useRef<Nullable<editor.IStandaloneCodeEditor>>(null);
  const monacoRef = React.useRef<Nullable<Monaco>>(null);

  const {
    accessToken,
    enabledQuery,
    updateOpenCmdk,
    updateEditorRef,
    updateMonacoRef,
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
            updatePipeline.mutateAsync({
              rawRecipe: newRawRecipe,
              namespacePipelineName: pipelineName,
              accessToken,
            });
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
    if (!pipeline.isSuccess) {
      return;
    }

    setUnsavedRawRecipe(pipeline.data.rawRecipe);
  }, [pipeline.isSuccess, pipeline.data]);

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

  React.useEffect(() => {
    if (!monacoRef.current || !pipeline.isSuccess) {
      return;
    }

    if (autoCompleteDisposableRef.current) {
      autoCompleteDisposableRef.current.dispose();
    }

    const disposable =
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

    autoCompleteDisposableRef.current = disposable;
  }, [pipeline.data, pipeline.isSuccess]);

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

      // We need to hint task type for every component.
      // 1. We need to find the component that the user is typing in. -> Check the closest and smallest component key line number.
      // 2. We need to find the task type for the component.
      const componentKeyLineNumberMaps =
        keyLineNumberMapHelpers.getAllComponentKeyLineNumberMaps(allValue);

      const smallestComponentKeyLineNumberMap = componentKeyLineNumberMaps
        .reverse()
        .find((map) => map.lineNumber <= position.lineNumber);

      if (
        last_chars.includes("task:") &&
        smallestComponentKeyLineNumberMap &&
        pipeline.isSuccess &&
        pipeline.data.recipe.component
      ) {
        const targetComponent =
          pipeline.data.recipe.component[smallestComponentKeyLineNumberMap.key];

        if (targetComponent && isPipelineGeneralComponent(targetComponent)) {
          const taskKeys =
            targetComponent.definition?.tasks.map((task) => task.name) ?? [];

          for (const key of taskKeys) {
            result.push({
              label: key,
              kind: monaco.languages.CompletionItemKind.Field,
              insertText: key,
              filterText: key,
              range: new monaco.Range(
                position.lineNumber,
                position.column - active_typing.length,
                position.lineNumber,
                position.column,
              ),
              documentation: {
                value: `# ${key} \n hello-world [Microsoft](http://www.microsoft.com)`,
                isTrusted: true,
              },
            });
          }

          return {
            suggestions: result,
          };
        }
      }

      // We need to hint instill-format for variables
      const topLevelKeyLineNumberMaps =
        keyLineNumberMapHelpers.getTopLevelKeyLineNumberMaps(allValue);

      const smallestTopLevelKeyLineNumberMap = topLevelKeyLineNumberMaps
        .reverse()
        .find((map) => map.lineNumber <= position.lineNumber);

      if (
        smallestTopLevelKeyLineNumberMap &&
        smallestTopLevelKeyLineNumberMap.key === "variable" &&
        last_chars.includes("instill-format:")
      ) {
        for (const format of availableInstillFormats) {
          result.push({
            label: format,
            kind: monaco.languages.CompletionItemKind.Field,
            insertText: format,
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
        if (active_typing.includes("secret") && namespaceSecrets.isSuccess) {
          for (const secret of namespaceSecrets.data) {
            result.push({
              label: secret.id,
              kind: monaco.languages.CompletionItemKind.Field,
              insertText: "${" + "secret." + secret.id,
              filterText: "${" + "secret." + secret.id,
              documentation: secret.description ?? undefined,
              range: new monaco.Range(
                position.lineNumber,
                position.column - active_typing.length,
                position.lineNumber,
                position.column,
              ),
              detail: secret.description ?? undefined,
            });
          }

          return {
            suggestions: result,
          };
        }

        if (active_typing.includes("variable") && recipe.variable) {
          const allHints = recipe.variable;

          for (const [key, value] of Object.entries(allHints)) {
            result.push({
              label: key,
              kind: monaco.languages.CompletionItemKind.Field,
              insertText: "${" + "variable." + key,
              filterText: "${" + "variable." + key,
              documentation: {
                value: `**${key}** \n\n instill-format: ${value.instillFormat}`,
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

        // Is a member, get a list of all members, and the prefix
        const objPath = active_typing
          .substring(0, active_typing.length - 1)
          .replaceAll("${", "")
          .replaceAll("}", "");
        const regex = /\[(\d+)\]/g;
        const matches = objPath.match(regex);
        const objPathWoIndex = objPath.replaceAll(regex, "");

        const hint = dot.getter(allHints, objPathWoIndex) as GeneralRecord;

        console.log(allHints, hint, objPath, matches, objPathWoIndex);

        if (hint.type === "objectArray") {
          const regex = /\[(\d+)\]/g;
          const matches = objPath.match(regex);

          if (matches && matches[0]) {
            const arrayHint = dot.getter(
              allHints,
              objPathWoIndex,
            ) as GeneralRecord;

            for (const [key] of Object.entries(arrayHint)) {
              result.push({
                label: key,
                kind: monaco.languages.CompletionItemKind.Field,
                insertText: "${" + objPath + "." + key,
                filterText: "${" + objPath + "." + key,
                documentation: `## ${key}  OMG`,
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
            documentation: `## ${key} \n\n ${value.description}`,
            range: new monaco.Range(
              position.lineNumber,
              position.column - active_typing.length,
              position.lineNumber,
              position.column,
            ),
            detail: value.instillFormat ?? "",
          });
        }

        return {
          suggestions: result,
        };
      }

      const referenceRegex = /\${/g;
      const isReference = referenceRegex.test(active_typing);

      if (isReference) {
        const componentKeys: string[] = [];
        for (const [key, value] of Object.entries(component)) {
          if (isPipelineGeneralComponent(value)) {
            componentKeys.push(key);
          }
        }

        for (const key of componentKeys) {
          result.push({
            label: key,
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: "${" + key,
            filterText: "${" + key,
            documentation: {
              value: `## ${key} hello-world`,
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

        if (recipe.variable) {
          result.push({
            label: "variable",
            kind: monaco.languages.CompletionItemKind.Variable,
            insertText: "${" + "variable",
            filterText: "${" + "variable",
            documentation: {
              value: `## hello-world`,
            },
            range: new monaco.Range(
              position.lineNumber,
              position.column - active_typing.length,
              position.lineNumber,
              position.column,
            ),
          });
        }

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

  return (
    <React.Fragment>
      <style jsx>{`
        .rendered-markdown > h1 {
          font-size: 1.5rem;
          font-weight: 600;
        }
      `}</style>
      <Editor
        language="yaml"
        className="text-lg rounded-b"
        onChange={(value) => {
          if (!value || !pipeline.isSuccess) {
            return;
          }

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

          setUnsavedRawRecipe(value);

          const res = validateVSCodeYaml(value);

          if (res.success) {
            setMarkErrors([]);
          } else {
            setUnsavedRawRecipe(value);
            setMarkErrors(res.markers);
          }
        }}
        value={unsavedRawRecipe ?? ""}
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
        }}
        onMount={(editor, monaco) => {
          editorRef.current = editor;
          updateEditorRef(() => editor);
          monacoRef.current = monaco;
          updateMonacoRef(() => monaco);
          const disposable = monaco.languages.registerCompletionItemProvider(
            "yaml",
            {
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
            },
          );
          autoCompleteDisposableRef.current = disposable;

          monaco.languages.registerHoverProvider("yaml", {
            provideHover: (model, position) => {
              const word = model.getWordAtPosition(position);

              console.log(word, position);

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
          });

          editor.addAction({
            id: "open-cmdk",
            label: "Open Cmdk",
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK],
            contextMenuOrder: 1,
            run: () => {
              updateOpenCmdk(() => true);
            },
          });
        }}
      />
    </React.Fragment>
  );
};
