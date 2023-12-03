import * as React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import {
  InstillStore,
  extensions,
  useInstillStore,
  useShallow,
  useUserPipeline,
  customMarkdownParser,
} from "../../../lib";
import { useRouter } from "next/router";
import { EditorState } from "@tiptap/pm/state";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const Readme = () => {
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));
  const router = useRouter();
  const { id, entity } = router.query;

  const pipeline = useUserPipeline({
    pipelineName: id ? `users/${entity}/pipelines/${id}` : null,
    accessToken,
    enabled: enabledQuery,
  });

  const editor = useEditor({
    extensions: extensions,
    editable: false,
    editorProps: {
      attributes: {
        class: "markdown-body",
      },
    },
    content: "",
  });

  React.useEffect(() => {
    if (!pipeline.isSuccess || !editor) return;

    const parsed = customMarkdownParser.parse(pipeline.data.description);

    if (!parsed) return;

    editor.view.updateState(EditorState.create({ doc: parsed }));
  }, [pipeline.data, pipeline.isSuccess, editor]);

  return (
    <div className="flex w-full flex-1">
      <EditorContent editor={editor} />
    </div>
  );
};
