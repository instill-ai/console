import cn from "clsx";
import * as React from "react";
import * as z from "zod";
import { UseFormReturn, useForm } from "react-hook-form";
import { Form, Icons, Tooltip } from "@instill-ai/design-system";
import { useShallow } from "zustand/react/shallow";

import { AutoresizeInputWrapper } from "../../../../../components";
import { InstillStore, useInstillStore } from "../../../../../lib";
import { zodResolver } from "@hookform/resolvers/zod";

const NodeIDEditorSchema = z.object({
  nodeID: z.string().nullable().optional(),
});

const selector = (store: InstillStore) => ({
  testModeEnabled: store.testModeEnabled,
});

export function useNodeIDEditorForm(nodeID: string) {
  return useForm<z.infer<typeof NodeIDEditorSchema>>({
    resolver: zodResolver(NodeIDEditorSchema),
    mode: "onBlur",
    defaultValues: {
      nodeID,
    },
  });
}

export const NodeIDEditor = ({
  form,
  nodeID,
  handleRename,
}: {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  form: UseFormReturn<z.infer<typeof NodeIDEditorSchema>, any, undefined>;
  nodeID: string;
  handleRename: (newID: string) => void;
}) => {
  const nodeIDInputRef = React.useRef<HTMLInputElement>(null);

  const { testModeEnabled } = useInstillStore(useShallow(selector));

  function handleSubmit() {
    form.handleSubmit((data) => {
      if (!data.nodeID || data.nodeID === "") {
        form.reset({
          nodeID,
        });
        return;
      }

      if (data.nodeID) {
        handleRename(data.nodeID);
      }
    })();
  }

  return (
    <div className="flex flex-row">
      <Form.Root {...form}>
        <form className="my-auto flex">
          <Form.Field
            control={form.control}
            name="nodeID"
            render={({ field }) => {
              const textStyle =
                "text-semantic-fg-secondary product-body-text-4-medium";

              return (
                <AutoresizeInputWrapper
                  value={field.value ?? ""}
                  className="h-8 min-w-[36px] max-w-[150px]"
                  placeholderClassname={cn(textStyle, "p-1")}
                >
                  <input
                    {...field}
                    className={cn(
                      "!absolute !bottom-0 !left-0 !right-0 !top-0 bg-transparent p-1 focus:!ring-1 focus:!ring-semantic-accent-default",
                      textStyle
                    )}
                    ref={nodeIDInputRef}
                    value={field.value ?? ""}
                    type="text"
                    autoComplete="off"
                    disabled={testModeEnabled}
                    onBlur={() => handleSubmit()}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    onKeyDown={(e) => {
                      // Disable enter key to prevent default form submit behavior
                      if (e.key === "Enter") {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSubmit();
                      }
                    }}
                  />
                </AutoresizeInputWrapper>
              );
            }}
          />
        </form>
      </Form.Root>
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            {/* 
              eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            */}
            <span className="flex" tabIndex={0}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nodeIDInputRef.current?.focus();
                }}
                type="button"
              >
                <Icons.Edit03 className="h-4 w-4 stroke-semantic-fg-primary" />
              </button>
            </span>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              side="top"
              className="rounded-sm bg-semantic-bg-primary !px-3 !py-2 !product-body-text-4-semibold"
            >
              Edit the component ID
              <Tooltip.Arrow
                className="fill-semantic-bg-primary"
                offset={10}
                width={9}
                height={6}
              />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
  );
};
