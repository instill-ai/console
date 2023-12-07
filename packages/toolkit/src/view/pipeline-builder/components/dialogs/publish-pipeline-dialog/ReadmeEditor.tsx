import * as React from "react";
import * as z from "zod";
import { EditorContent, useEditor } from "@tiptap/react";
import {
  InstillStore,
  Nullable,
  deserialize,
  extensions,
  serialize,
  useInstillStore,
  useShallow,
  useUserPipeline,
} from "../../../../../lib";
import { UseFormReturn } from "react-hook-form";
import { PublishPipelineFormSchema } from "./PublishPipelineDialog";
import { Form } from "@instill-ai/design-system";
import { useRouter } from "next/router";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  pipelineIsNew: store.pipelineIsNew,
});

export const ReadmeEditor = ({
  form,
}: {
  form: UseFormReturn<
    z.infer<typeof PublishPipelineFormSchema>,
    any,
    undefined
  >;
}) => {
  const { accessToken, enabledQuery, pipelineIsNew } = useInstillStore(
    useShallow(selector)
  );
  const router = useRouter();
  const { id, entity } = router.query;

  const pipeline = useUserPipeline({
    pipelineName: `users/${entity}/pipelines/${id}`,
    accessToken,
    enabled: enabledQuery && !!accessToken && !pipelineIsNew,
  });

  const timer = React.useRef<Nullable<number>>(null);
  const editor = useEditor({
    extensions: extensions,
    editorProps: {
      attributes: {
        class: "w-full h-full markdown-body rounded-[12px] p-6",
      },
    },
    onUpdate: ({ editor }) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }

      timer.current = window.setTimeout(() => {
        try {
          const md = serialize(editor.schema, editor.getJSON());
          form.setValue("description", md);
        } catch (err) {
          console.error(err);
        }
      }, 1000);
    },
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
    <Form.Field
      control={form.control}
      name="description"
      render={() => {
        return (
          <Form.Item className="h-full w-full flex-1 px-8">
            <Form.Control>
              <div className="h-full rounded-[12px] border border-semantic-bg-line">
                <EditorContent className="h-full" editor={editor} />
              </div>
            </Form.Control>
            <Form.Message />
          </Form.Item>
        );
      }}
    />
  );
};
