import { EditorContent, useEditor } from "@tiptap/react";
import {
  InstillStore,
  extensions,
  useInstillStore,
  useShallow,
  useUserPipeline,
} from "../../../lib";
import { useRouter } from "next/router";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const PipelineViewReadme = () => {
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
    content: pipeline.isSuccess ? pipeline.data.description : "",
  });

  return (
    <div className="flex w-full flex-1">
      <EditorContent editor={editor} />
    </div>
  );
};
