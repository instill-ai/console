import cn from "clsx";
import * as React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import {
  InstillStore,
  extensions,
  useInstillStore,
  useShallow,
  deserialize,
  Nullable,
  useUpdateUserPipeline,
  serialize,
  UpdateUserPipelinePayload,
} from "../../../lib";
import { useRouter } from "next/router";
import { useToast } from "@instill-ai/design-system";
import { LoadingSpin } from "../../../components";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
});

export const Readme = ({
  isOwner,
  readme,
}: {
  isOwner: boolean;
  readme: Nullable<string>;
}) => {
  const { accessToken } = useInstillStore(useShallow(selector));
  const router = useRouter();
  const { id, entity } = router.query;
  const { toast } = useToast();

  const timer = React.useRef<Nullable<number>>(null);

  const [isInitialized, setIsInitialized] = React.useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);

  const updateUserPipeline = useUpdateUserPipeline();

  const editor = useEditor({
    extensions: extensions,
    editable: isOwner,
    editorProps: {
      attributes: {
        class:
          "markdown-body h-full p-5 rounded-md !bg-transparent focus-within:outline focus-within:outline-2 focus-within:outline-semantic-accent-default",
      },
    },
    content: "",
    onBlur: ({ editor }) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }

      setHasUnsavedChanges(true);

      timer.current = window.setTimeout(() => {
        try {
          const md = serialize(editor.schema, editor.getJSON());

          const payload: UpdateUserPipelinePayload = {
            name: `users/${entity}/pipelines/${id}`,
            readme: md,
          };

          updateUserPipeline.mutateAsync({ payload, accessToken });

          toast({
            size: "small",
            title: "Update pipeline readme successfully",
            variant: "alert-success",
          });

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
    if (!editor) return;

    editor.setEditable(isOwner);
  }, [isOwner, editor]);

  React.useEffect(() => {
    if (!readme || !editor || isInitialized) return;

    const parsed = deserialize(editor.schema, readme);

    setIsInitialized(true);

    editor.commands.setContent(parsed);
  }, [readme, editor, isInitialized]);

  return (
    <div className="flex w-full flex-1 flex-col">
      <EditorContent
        className={cn(
          "mb-2 h-full w-full bg-transparent",
          hasUnsavedChanges ? "rounded-sm border-2 border-semantic-bg-line" : ""
        )}
        editor={editor}
      />
      {hasUnsavedChanges ? (
        <div className="ml-auto flex gap-x-2">
          <div>
            <LoadingSpin className="!text-semantic-fg-disabled" />
          </div>
          <p className="my-auto text-semantic-fg-disabled product-body-text-4-medium">
            Have unsaved changes
          </p>
        </div>
      ) : null}
    </div>
  );
};
