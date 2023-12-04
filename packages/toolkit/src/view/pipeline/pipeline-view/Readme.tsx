import * as React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import {
  InstillStore,
  extensions,
  useInstillStore,
  useShallow,
  useUserPipeline,
  deserialize,
} from "../../../lib";
import { useRouter } from "next/router";

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
    enabled: enabledQuery && !!accessToken,
  });

  const editor = useEditor({
    extensions: extensions,
    editable: false,
    editorProps: {
      attributes: {
        class: "markdown-body h-full p-5",
      },
    },
    content: "",
  });

  React.useEffect(() => {
    if (!pipeline.isSuccess || !editor) return;

    if (!pipeline.data.description) {
      return;
    }

    const parsed = deserialize(editor.schema, pipeline.data.description);

    editor.commands.setContent(parsed);
  }, [pipeline.data, pipeline.isSuccess, editor]);

  return (
    <div className="flex w-full flex-1">
      <EditorContent className="h-full w-full" editor={editor} />
    </div>
  );
};
