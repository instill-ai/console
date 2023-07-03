import cn from "clsx";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useToast } from "@instill-ai/design-system";
import { PipelineBuilderStore, usePipelineBuilderStore } from "@/stores";
import { shallow } from "zustand/shallow";
import { useRenamePipeline } from "@instill-ai/toolkit";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const PipelineNameFormSchema = z.object({
  pipelineId: z.string().nullable(),
});

const pipelineBuilderSelector = (state: PipelineBuilderStore) => ({
  pipelineId: state.pipelineId,
  pipelineUid: state.pipelineUid,
  setPipelineId: state.setPipelineId,
  setIsSavingPipeline: state.setIsSavingPipeline,
});

export const PipelineNameForm = () => {
  const router = useRouter();

  const { pipelineId, pipelineUid, setPipelineId, setIsSavingPipeline } =
    usePipelineBuilderStore(pipelineBuilderSelector, shallow);
  const [isFocused, setIsFocused] = useState(false);

  const form = useForm<z.infer<typeof PipelineNameFormSchema>>({
    resolver: zodResolver(PipelineNameFormSchema),
  });

  useEffect(() => {
    form.reset({
      pipelineId: router.asPath.split("/")[2],
    });
  }, [router.isReady, router.asPath, form]);

  const { toast } = useToast();

  const renamePipeline = useRenamePipeline();

  function onSubmit(data: z.infer<typeof PipelineNameFormSchema>) {
    setIsSavingPipeline(true);

    if (pipelineUid && pipelineId && data.pipelineId) {
      renamePipeline.mutate(
        {
          payload: {
            pipelineId,
            newPipelineId: data.pipelineId,
          },
          accessToken: null,
        },
        {
          onSuccess: () => {
            setIsSavingPipeline(false);
            setPipelineId(data.pipelineId);
            form.reset({
              pipelineId: data.pipelineId,
            });
            toast({
              title: "Pipeline renamed",
              description: "Your pipeline has been renamed.",
              variant: "alert-success",
              size: "large",
            });
            router.push(`/pipelines/${data.pipelineId}`, undefined, {
              shallow: true,
            });
          },
        }
      );
      return;
    }

    setPipelineId(data.pipelineId);
    form.reset({
      pipelineId: data.pipelineId,
    });

    setIsSavingPipeline(false);
    router.push(`/pipelines/${data.pipelineId}`, undefined, {
      shallow: true,
    });
  }

  return (
    <Form.Root {...form}>
      <div className="flex flex-row pl-4">
        <Link
          className={cn(
            "mr-2 flex flex-row space-x-2",
            isFocused ? "hidden" : ""
          )}
          href="/pipelines"
        >
          <p className="my-auto text-semantic-bg-secondary product-headings-heading-6">
            Pipelines
          </p>
          <p className="my-auto pb-0.5 text-semantic-bg-secondary product-headings-heading-6">
            /
          </p>
        </Link>
        <form
          className="my-auto flex flex-row items-center justify-center"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Form.Field
            control={form.control}
            name="pipelineId"
            render={({ field }) => {
              return (
                <input
                  className="bg-transparent py-2 text-semantic-bg-primary product-headings-heading-6 focus:outline-none focus:ring-0"
                  {...field}
                  value={field.value ?? "Untitled Pipeline"}
                  type="text"
                  autoComplete="off"
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => {
                    setIsFocused(false);
                    setTimeout(() => {
                      form.handleSubmit(onSubmit)();
                    }, 1000);
                  }}
                />
              );
            }}
          />
        </form>
      </div>
    </Form.Root>
  );
};
