"use client";

/**
 * Partial CompletionItems?
 * https://github.com/Microsoft/monaco-editor/issues/379
 *
 * Use storage services to custom intellisense
 * https://stackoverflow.com/questions/54795603/always-show-the-show-more-section-in-monaco-editor
 */
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
  useRouteInfo,
  useShallow,
  useUpdateNamespacePipeline,
} from "../../lib";
import { transformInstillJSONSchemaToFormTree } from "../../lib/use-instill-form/transform";
import { transformFormTreeToNestedSmartHints } from "../../lib/use-smart-hint/transformFormTreeToNestedSmartHints";
import { getGeneralComponentInOutputSchema } from "../pipeline-builder";
import { isPipelineGeneralComponent } from "../pipeline-builder/lib/checkComponentType";
import { validateVSCodeYaml } from "./validateVSCodeYaml";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  updateOpenCmdk: store.updateOpenCmdk,
  updateEditorRef: store.updateEditorRef,
  updateMonacoRef: store.updateMonacoRef,
});

export const VscodeEditor = () => {
  const [markErrors, setMarkErrors] = React.useState<editor.IMarkerData[]>([]);

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

        try {
          updatePipeline.mutateAsync({
            rawRecipe: newRawRecipe,
            namespacePipelineName: pipelineName,
            accessToken,
          });
        } catch (error) {
          console.error(error);
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

      if (!monaco) {
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
      const words = last_chars.replace("\t", "").split(" ");

      // What the user is currently typing (everything after the last space)
      const active_typing = words[words.length - 1];

      if (!active_typing) {
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

      console.log("isMember", isMember);

      if (isMember) {
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
                detail: key,

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
            detail: key,
            documentation: `## ${key}  ${value.description}`,
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

      if (isReference) {
        const allHints: string[] = [];
        for (const [key, value] of Object.entries(component)) {
          if (isPipelineGeneralComponent(value)) {
            allHints.push(key);
          }
        }

        for (const hint of allHints) {
          result.push({
            label: hint,
            kind: monaco.languages.CompletionItemKind.Field,
            insertText: "${" + hint,
            filterText: "${" + hint,
            detail: hint,
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
    [],
  );

  return (
    <Editor
      language="yaml"
      onChange={(value) => {
        if (!value || !pipeline.isSuccess) {
          return;
        }

        const res = validateVSCodeYaml(value);

        if (res.success) {
          setMarkErrors([]);
          recipeUpdater({
            pipelineName: pipeline.data.name,
            newRawRecipe: value,
            accessToken,
          });

          // try {
          //   if (!pipelineName) {
          //     return;
          //   }
          //   debounce(() => {
          //     console.log("what");
          //     updatePipeline.mutateAsync({
          //       rawRecipe: value,
          //       namespacePipelineName: pipelineName,
          //       accessToken,
          //     });
          //   }, 1000);
          // } catch (error) {
          //   console.error(error);
          // }
        } else {
          setMarkErrors(res.markers);
        }
      }}
      value={pipeline.data?.rawRecipe ?? ""}
      options={{
        minimap: {
          enabled: false,
        },
        automaticLayout: true,
        quickSuggestions: {
          other: true,
          comments: false,
          strings: true,
        },
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
  );
};
