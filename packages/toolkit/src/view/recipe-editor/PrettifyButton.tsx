import { Button } from "@instill-ai/design-system";
import { useEditor } from "./EditorContext";
import * as prettier from "prettier/standalone";
import * as yamlPlugin from "prettier/plugins/yaml.js";

export const PrettifyButton = () => {
  const { editorRef } = useEditor();

  return (
    <Button
      onClick={async () => {
        if (!editorRef.current || !editorRef.current.view) {
          return;
        }

        const editorView = editorRef.current.view;

        const prettifiedText = await prettier.format(
          editorView.state.doc.toString(),
          {
            parser: "yaml",
            printWidth: 100,
            tabWidth: 2,
            useTabs: false,
            plugins: [yamlPlugin],
          }
        );

        editorView.dispatch({
          changes: {
            from: 0,
            to: editorView.state.doc.length,
            insert: prettifiedText,
          },
        });
      }}
      variant="tertiaryColour"
      size="md"
    >
      Prettify
    </Button>
  );
};
