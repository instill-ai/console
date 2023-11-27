import * as React from "react";
import { EditorView } from "@codemirror/view";
import ReactCodeMirror from "@uiw/react-codemirror";
import { Nullable } from "../lib";
import { githubDark } from "@uiw/codemirror-theme-github";
import { json } from "@codemirror/lang-json";

const fontSize = EditorView.baseTheme({
  "&": {
    backgroundColor: "#fff",
    fontSize: "12px",
  },
});

export const ObjectViewer = ({ value }: { value: Nullable<string> }) => {
  return (
    <React.Fragment>
      <style jsx>{`
        .cm-gutters {
          border-radius: 8px 0 0 8px;
          background-color: #1b1f27 !important;
        }
        .cm-editor {
          border-radius: 8px;
        }
        .cm-content {
          background-color: #0a0d14 !important;
        }
      `}</style>
      <ReactCodeMirror
        value={value ?? ""}
        extensions={[EditorView.lineWrapping, fontSize, json()]}
        theme={githubDark}
        editable={false}
        maxHeight="225px"
        basicSetup={{
          highlightActiveLineGutter: false,
          highlightActiveLine: false,
          lineNumbers: true,
        }}
      />
    </React.Fragment>
  );
};
