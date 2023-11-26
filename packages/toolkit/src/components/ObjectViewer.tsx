import * as React from "react";
import { EditorView } from "@codemirror/view";
import ReactCodeMirror from "@uiw/react-codemirror";
import { Nullable } from "../lib";
import { githubDark } from "@uiw/codemirror-theme-github";
import { jsonLanguage, json } from "@codemirror/lang-json";

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
          width: 20px;
        }
        .cm-gutter {
          width: 20px;
        }
        .cm-editor {
          border-radius: 8px;
        }
        .cm-gutterElement {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
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
          lineNumbers: false,
        }}
      />
    </React.Fragment>
  );
};
