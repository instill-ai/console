"use client";

import * as React from "react";
import { linter, lintGutter } from "@codemirror/lint";
import { EditorView } from "@codemirror/view";
import { langs } from "@uiw/codemirror-extensions-langs";
import { githubLight } from "@uiw/codemirror-theme-github";
import CodeMirror from "@uiw/react-codemirror";

import { Nullable } from "../../lib";
import { validateYaml } from "./validateYaml";

export const Editor = ({ recipe }: { recipe: Nullable<string> }) => {
  return (
    <React.Fragment>
      <style jsx>
        {`
          .cm-editor {
            height: 100%;
          }
        `}
      </style>
      <div className="w-full h-full">
        <CodeMirror
          className="h-full"
          value={recipe ?? ""}
          extensions={[
            langs.yaml(),
            yamlLinter,
            lintGutter(),
            EditorView.lineWrapping,
          ]}
          theme={githubLight}
        />
      </div>
    </React.Fragment>
  );
};

const yamlLinter = linter((view) => {
  return validateYaml(view.state.doc.toString());
});
