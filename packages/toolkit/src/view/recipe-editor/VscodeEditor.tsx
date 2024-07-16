"use client";

import * as React from "react";
import Editor from "@monaco-editor/react";
import * as MonacoEditor from "monaco-editor";

import { Nullable } from "../../lib";

export const VscodeEditor = () => {
  const editorRef =
    React.useRef<Nullable<MonacoEditor.editor.IStandaloneCodeEditor>>(null);

  return (
    <Editor
      language="yaml"
      onMount={(editor, monaco) => {
        editorRef.current = editor;
        monaco.languages.registerCompletionItemProvider("yaml", {
          triggerCharacters: ["${"],
          provideCompletionItems: (model, position, token) => {
            // Split everything the user has typed on the current line up at each space, and only look at the last word
            const last_chars = model.getValueInRange({
              startLineNumber: position.lineNumber,
              startColumn: 0,
              endLineNumber: position.lineNumber,
              endColumn: position.column,
            });
            const words = last_chars.replace("\t", "").split(" ");

            const result: MonacoEditor.languages.CompletionItem[] = [];

            // What the user is currently typing (everything after the last space)
            const active_typing = words[words.length - 1];

            if (!active_typing) {
              return {
                suggestions: result,
              };
            }

            // If the last character typed is a period then we need to look at member objects of the obj object
            const is_member =
              active_typing.charAt(active_typing.length - 1) == ".";

            // Array of autocompletion results

            return {
              suggestions: [
                {
                  label: "test",
                  kind: monaco.languages.CompletionItemKind.Function,
                  insertText: "test",
                  detail: "test",
                },
              ],
            };
          },
        });
      }}
    />
  );
};
