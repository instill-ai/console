"use client";

import * as React from "react";
import { Nullable } from "instill-sdk";

import { Button, Dialog, Icons } from "@instill-ai/design-system";

import { InstillStore, useInstillStore, useShallow } from "../../../lib";
import { EditorButtonTooltipWrapper } from "../EditorButtonTooltipWrapper";
import { validateVSCodeYaml } from "../lib/validateVSCodeYaml";

const selector = (store: InstillStore) => ({
  editorRef: store.editorRef,
  importRecipeInputTriggerRef: store.importRecipeInputTriggerRef,
});

export const ImportRecipeDialog = () => {
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState<Nullable<string>>(null);
  const [recipe, setRecipe] = React.useState<Nullable<string>>(null);

  const { editorRef, importRecipeInputTriggerRef } = useInstillStore(
    useShallow(selector),
  );

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
      }}
    >
      <EditorButtonTooltipWrapper tooltipContent="⌘ I">
        <Button
          onClick={() => {
            importRecipeInputTriggerRef?.current?.click();
          }}
          className="flex flex-row gap-x-2"
          variant="tertiaryGrey"
        >
          <Icons.FileDownload03 className="w-[14px] h-[14px] stroke-semantic-fg-primary" />
          Import Recipe
        </Button>
      </EditorButtonTooltipWrapper>
      <input
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          // read the file and convert it into string
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result ? String(e.target.result) : null;

            if (!result) {
              return;
            }

            const yaml = validateVSCodeYaml(result, true);

            if (!yaml.success) {
              setError("Invalid YAML");
              setOpen(true);
              return;
            }

            setOpen(true);
            setRecipe(result);
          };

          if (file) {
            reader.readAsText(file);
          }
        }}
        type="file"
        accept=".yaml"
        ref={(e) => {
          if (!e) {
            return;
          }
          importRecipeInputTriggerRef.current = e;
        }}
        className="hidden"
      />
      <Dialog.Content
        style={{
          width: "400px",
        }}
        className="gap-y-6"
      >
        {error ? (
          <React.Fragment>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-semantic-warning-bg">
              <Icons.AlertTriangle className="h-6 w-6 stroke-semantic-warning-on-bg" />
            </div>
            <div className="flex flex-col gap-y-3">
              <Dialog.Title className="!mx-auto !product-headings-heading-3">
                Broken YAML Recipe
              </Dialog.Title>
              <Dialog.Description className="!mx-auto !text-center">
                The recipe you are trying to import is invalid. Please fix the
                recipe and try again
              </Dialog.Description>
            </div>
            <div className="flex flex-col gap-y-2">
              <Button
                onClick={() => {
                  setError(null);
                  setOpen(false);
                }}
                variant="secondaryGrey"
                size="lg"
              >
                Cancel
              </Button>
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-semantic-warning-bg">
              <Icons.AlertTriangle className="h-6 w-6 stroke-semantic-warning-on-bg" />
            </div>
            <div className="flex flex-col gap-y-3">
              <Dialog.Title className="!mx-auto !product-headings-heading-3">
                Unsaved changes
              </Dialog.Title>
              <Dialog.Description className="!mx-auto !text-center">
                You have unsaved changes. Do you want to save the changes before
                leaving this page?
              </Dialog.Description>
            </div>
            <div className="flex flex-col gap-y-2">
              <Button
                onClick={() => {
                  if (!editorRef || !recipe) {
                    setOpen(false);
                    return;
                  }

                  editorRef.setValue(recipe);
                  setOpen(false);
                }}
                variant="danger"
                size="lg"
              >
                Yes, Import And Overwrite.
              </Button>
              <Button
                onClick={() => {
                  setError(null);
                  setOpen(false);
                }}
                variant="secondaryGrey"
                size="lg"
              >
                No, Keep My Current Edits.
              </Button>
            </div>
          </React.Fragment>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
};
