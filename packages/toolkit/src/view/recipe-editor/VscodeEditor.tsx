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

import { dot, GeneralRecord, Nullable } from "../../lib";
import { transformInstillJSONSchemaToFormTree } from "../../lib/use-instill-form/transform";
import { transformFormTreeToNestedSmartHints } from "../../lib/use-smart-hint/transformFormTreeToNestedSmartHints";
import { getGeneralComponentInOutputSchema } from "../pipeline-builder";
import { isPipelineGeneralComponent } from "../pipeline-builder/lib/checkComponentType";
import { validateVSCodeYaml } from "./validateVSCodeYaml";

export const VscodeEditor = ({
  recipe,
}: {
  recipe: Nullable<PipelineRecipe>;
}) => {
  const [markErrors, setMarkErrors] = React.useState<editor.IMarkerData[]>([]);

  const autoCompleteDisposableRef = React.useRef<Nullable<IDisposable>>(null);
  const editorRef = React.useRef<Nullable<editor.IStandaloneCodeEditor>>(null);
  const monacoRef = React.useRef<Nullable<Monaco>>(null);

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
    if (!monacoRef.current || !recipe) {
      return;
    }

    if (autoCompleteDisposableRef.current) {
      autoCompleteDisposableRef.current.dispose();
    }

    const disposable =
      monacoRef.current.languages.registerCompletionItemProvider("yaml", {
        triggerCharacters: ["${", "."],
        provideCompletionItems: (model, position, token) => {
          return handleAutoComplete({
            model,
            position,
            monaco: monacoRef.current,
            recipe,
          });
        },
      });

    autoCompleteDisposableRef.current = disposable;
  }, [recipe]);

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

      // If the last character typed is a period then we need to look at member objects of the obj object
      const isMember = active_typing.charAt(active_typing.length - 1) == ".";

      const component = recipe?.component;

      if (!component) {
        return {
          suggestions: result,
        };
      }

      let allHints: GeneralRecord = {};

      for (const [key, value] of Object.entries(component)) {
        if (isPipelineGeneralComponent(value)) {
          const { outputSchema } = getGeneralComponentInOutputSchema(value);

          if (outputSchema) {
            const outputFormTree =
              transformInstillJSONSchemaToFormTree(outputSchema);

            const hints = transformFormTreeToNestedSmartHints(outputFormTree);

            allHints[key] = hints;
          }
        }
      }

      console.log("isMember", isMember);

      if (isMember) {
        // Is a member, get a list of all members, and the prefix
        const objPath = active_typing.substring(0, active_typing.length - 1);
        const regex = /\[(\d+)\]/g;
        const matches = objPath.match(regex);
        let objPathWoIndex = objPath.replaceAll(regex, "");

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

            for (const [key, value] of Object.entries(arrayHint)) {
              result.push({
                label: key,
                kind: monaco.languages.CompletionItemKind.Field,
                insertText: objPath + "." + key,
                filterText: objPath + "." + key,
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
          result.push({
            label: key,
            kind: monaco.languages.CompletionItemKind.Field,
            insertText: objPath + "." + key,
            filterText: objPath + "." + key,
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
      }

      console.log("result", result);

      return {
        suggestions: result,
      };
    },
    [],
  );

  React.useEffect(() => {}, []);

  return (
    <Editor
      language="yaml"
      onChange={(value) => {
        if (!value) {
          return;
        }

        const res = validateVSCodeYaml(value);

        if (res.success) {
          setMarkErrors([]);
        } else {
          setMarkErrors(res.markers);
        }
      }}
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
        monacoRef.current = monaco;
        const disposable = monaco.languages.registerCompletionItemProvider(
          "yaml",
          {
            triggerCharacters: ["${", "."],
            provideCompletionItems: (model, position, token) => {
              // Split everything the user has typed on the current line up at each space, and only look at the last word
              return handleAutoComplete({ model, position, monaco, recipe });
            },
          },
        );
        autoCompleteDisposableRef.current = disposable;
      }}
    />
  );
};
