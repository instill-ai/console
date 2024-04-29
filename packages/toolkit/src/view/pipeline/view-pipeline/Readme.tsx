"use client";

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
  sendAmplitudeData,
  useAmplitudeCtx,
  useAppEntity,
} from "../../../lib";
import { useToast } from "@instill-ai/design-system";
import { LoadingSpin } from "../../../components";
import { Editor } from "@tiptap/core";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
});

export const Readme = ({
  isEditable,
  readme,
}: {
  isEditable: boolean;
  readme: Nullable<string>;
}) => {
  const { amplitudeIsInit } = useAmplitudeCtx();
  const { accessToken } = useInstillStore(useShallow(selector));
  const { toast } = useToast();

  const entity = useAppEntity();

  const timer = React.useRef<Nullable<number>>(null);

  const [isInitialized, setIsInitialized] = React.useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);

  const updateUserPipeline = useUpdateUserPipeline();

  const onBlur = React.useCallback(
    (editor: Editor) => {
      if (!entity.isSuccess || !accessToken) {
        return;
      }

      if (timer.current) {
        clearTimeout(timer.current);
      }

      setHasUnsavedChanges(true);

      timer.current = window.setTimeout(async () => {
        if (!entity.data.pipelineName) {
          return;
        }

        try {
          const md = serialize(editor.schema, editor.getJSON());

          const payload: UpdateUserPipelinePayload = {
            name: entity.data.pipelineName,
            readme: md,
          };

          await updateUserPipeline.mutateAsync({ payload, accessToken });

          if (amplitudeIsInit) {
            sendAmplitudeData("update_pipeline_readme");
          }

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
    [
      entity.isSuccess,
      entity.data?.pipelineName,
      accessToken,
      toast,
      updateUserPipeline,
      amplitudeIsInit,
    ]
  );

  const editor = useEditor({
    extensions: extensions,
    editable: isEditable,
    editorProps: {
      attributes: {
        class:
          "markdown-body h-full p-5 rounded-sm !bg-transparent focus-within:outline focus-within:outline-2 focus-within:outline-semantic-accent-default",
      },
    },
    content: "",
    onBlur: ({ editor }) => {
      onBlur(editor);
    },
  });

  React.useEffect(() => {
    if (!editor) return;

    editor.setEditable(isEditable);
  }, [isEditable, editor]);

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
          "mb-2 h-[718px] w-full rounded-sm border",
          hasUnsavedChanges ? "rounded-sm border-semantic-bg-line" : ""
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
