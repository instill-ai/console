import cn from "clsx";
import * as React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import {
  InstillStore,
  extensions,
  useInstillStore,
  useShallow,
  useUserPipeline,
  deserialize,
  Nullable,
  useUpdateUserPipeline,
  serialize,
  UpdateUserPipelinePayload,
} from "../../../lib";
import { useRouter } from "next/router";
import { useToast } from "@instill-ai/design-system";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const Readme = () => {
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));
  const router = useRouter();
  const { id, entity } = router.query;
  const { toast } = useToast();

  const timer = React.useRef<Nullable<number>>(null);

  const pipeline = useUserPipeline({
    pipelineName: id ? `users/${entity}/pipelines/${id}` : null,
    accessToken,
    enabled: enabledQuery && !!accessToken,
  });

  const [isInitialized, setIsInitialized] = React.useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);

  const updateUserPipeline = useUpdateUserPipeline();

  const editor = useEditor({
    extensions: extensions,
    editable: true,
    editorProps: {
      attributes: {
        class:
          "markdown-body h-full p-5 rounded-md !bg-transparent focus-within:outline focus-within:outline-2 focus-within:outline-semantic-accent-default",
      },
    },
    content: "",
    onUpdate: ({ editor }) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }

      setHasUnsavedChanges(true);

      timer.current = window.setTimeout(() => {
        try {
          const md = serialize(editor.schema, editor.getJSON());

          const payload: UpdateUserPipelinePayload = {
            name: `users/${entity}/pipelines/${id}`,
            description: md,
          };

          toast({
            size: "small",
            title: "Update pipeline readme successfully",
            variant: "alert-success",
          });

          updateUserPipeline.mutateAsync({ payload, accessToken });
          setHasUnsavedChanges(false);
        } catch (err) {
          toast({
            size: "small",
            title:
              "Something went wrong, Please refresh the page and try again later",
            variant: "alert-error",
          });

          console.error(err);
        }
      }, 1000);
    },
  });

  React.useEffect(() => {
    if (!pipeline.isSuccess || !editor || isInitialized) return;

    if (!pipeline.data.description) {
      return;
    }

    const parsed = deserialize(editor.schema, pipeline.data.description);

    setIsInitialized(true);

    editor.commands.setContent(parsed);
  }, [pipeline.data, pipeline.isSuccess, editor, isInitialized]);

  return (
    <div className="flex w-full flex-1 flex-col">
      <EditorContent
        className={cn(
          "h-full w-full bg-transparent",
          hasUnsavedChanges ? "rounded-sm border-2 border-semantic-bg-line" : ""
        )}
        editor={editor}
      />
      {hasUnsavedChanges ? (
        <div className="flex w-full flex-row-reverse">
          <p className="text-semantic-fg-disabled product-body-text-4-medium">
            Have unsaved changes
          </p>
        </div>
      ) : null}
    </div>
  );
};
