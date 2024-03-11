import * as z from "zod";
import * as React from "react";
import { Form, Input, Popover } from "@instill-ai/design-system";
import { useRenamePipeline } from "../../lib";
import { InstillStore, useInstillStore, useShallow } from "../../../../lib";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { LoadingSpin } from "../../../../components";

const selector = (store: InstillStore) => ({
  pipelineId: store.pipelineId,
});

const pipelineNameSchema = z.object({
  id: z.string().min(1, "Pipeline name is required"),
});

export const PipelineName = () => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const renamePipeline = useRenamePipeline();
  const form = useForm<z.infer<typeof pipelineNameSchema>>({
    resolver: zodResolver(pipelineNameSchema),
  });

  const { pipelineId } = useInstillStore(useShallow(selector));

  React.useEffect(() => {
    form.reset({
      id: router.asPath.split("/")[3],
    });
  }, [router.isReady, router.asPath, form]);

  React.useEffect(() => {
    if (!pipelineId) return;
    form.reset({
      id: pipelineId,
    });
  }, [pipelineId, form]);

  const handleRename = async (formData: z.infer<typeof pipelineNameSchema>) => {
    if (!pipelineId) {
      return;
    }

    if (pipelineId === formData.id) {
      return;
    }

    setSaving(true);

    try {
      await renamePipeline(formData.id);
      setSaving(false);
      setOpen(false);
    } catch (error) {
      setSaving(false);
      setOpen(false);
      form.reset({ id: pipelineId });
    }
  };

  return (
    <Popover.Root
      open={open}
      onOpenChange={async (newOpen) => {
        if (open === true && newOpen === false) {
          await handleRename(form.getValues());
        }
        setOpen(newOpen);
      }}
    >
      <Popover.Trigger asChild>
        <p className="cursor-pointer text-semantic-fg-primary product-body-text-3-semibold">
          {pipelineId}
        </p>
      </Popover.Trigger>
      <Popover.Content className="!w-[320px]">
        <Form.Root {...form}>
          <form
            onSubmit={form.handleSubmit(handleRename)}
            className="flex flex-col"
          >
            <div>
              <Form.Field
                control={form.control}
                name="id"
                render={({ field }) => {
                  return (
                    <Form.Item className="w-full">
                      <Form.Label className="product-body-text-3-semibold">
                        Name
                        {saving ? <LoadingSpin /> : null}
                      </Form.Label>
                      <Form.Control>
                        <Input.Root>
                          <Input.Core
                            {...field}
                            type="text"
                            className="!product-body-text-2-regular"
                            value={field.value ?? ""}
                            autoComplete="off"
                          />
                        </Input.Root>
                      </Form.Control>
                      <Form.Message />
                    </Form.Item>
                  );
                }}
              />
            </div>
          </form>
        </Form.Root>
      </Popover.Content>
    </Popover.Root>
  );
};
