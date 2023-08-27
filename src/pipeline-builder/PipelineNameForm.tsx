import { shallow } from "zustand/shallow";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Nullable,
  getInstillApiErrorMessage,
  useRenamePipeline,
} from "@instill-ai/toolkit";
import {
  PipelineBuilderStore,
  usePipelineBuilderStore,
} from "./usePipelineBuilderStore";
import { Form, Icons, useToast } from "@instill-ai/design-system";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { isAxiosError } from "axios";

const pipelineBuilderSelector = (state: PipelineBuilderStore) => ({
  pipelineId: state.pipelineId,
  setPipelineId: state.setPipelineId,
  pipelineIsNew: state.pipelineIsNew,
});

export type PipelineNameFormProps = {
  accessToken: Nullable<string>;
};

export const UpdatePipelineNameSchema = z.object({
  pipelineId: z.string().min(1, { message: "Title is required" }),
});

export const PipelineNameForm = (props: PipelineNameFormProps) => {
  const { accessToken } = props;
  const router = useRouter();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof UpdatePipelineNameSchema>>({
    resolver: zodResolver(UpdatePipelineNameSchema),
    mode: "onBlur",
  });

  const { pipelineId, setPipelineId, pipelineIsNew } = usePipelineBuilderStore(
    pipelineBuilderSelector,
    shallow
  );

  // Disable edit on the topbar
  useEffect(() => {
    form.reset({
      pipelineId: router.asPath.split("/")[2],
    });
  }, [router.isReady, router.asPath, form]);

  useEffect(() => {
    if (!pipelineId) return;
    form.reset({
      pipelineId,
    });
  }, [pipelineId, form]);

  const renamePipeline = useRenamePipeline();

  async function handleRenamePipeline(newId: string) {
    if (!pipelineId || pipelineIsNew) {
      return;
    }

    try {
      await renamePipeline.mutateAsync({
        payload: {
          pipelineId: pipelineId,
          newPipelineId: newId,
        },
        accessToken,
      });

      await router.push(`/pipelines/${newId}`, undefined, {
        shallow: true,
      });

      toast({
        title: "Sussessfully renamed the pipeline",
        variant: "alert-success",
        size: "small",
      });

      setPipelineId(newId);
    } catch (error) {
      if (isAxiosError(error)) {
        toast({
          title: "Something went wrong when rename the pipeline",
          description: getInstillApiErrorMessage(error),
          variant: "alert-error",
          size: "large",
        });
      } else {
        toast({
          title: "Something went wrong when rename the pipeline",
          variant: "alert-error",
          description: "Please try again later",
          size: "large",
        });
      }
    }
  }

  return (
    <div className="flex w-full pl-4">
      <div className="flex flex-row gap-x-3">
        <Link className="flex flex-row gap-x-3" href="/pipelines">
          <Icons.ArrowLeft className="my-auto h-5 w-5 stroke-semantic-fg-disabled-on-secondary-bg" />
          <p className="my-auto text-semantic-fg-disabled-on-secondary-bg product-body-text-3-medium">
            Pipelines
          </p>
        </Link>
        <p className="my-auto pb-0.5 text-semantic-fg-disabled-on-secondary-bg product-headings-heading-6">
          /
        </p>
        <Form.Root {...form}>
          <form className="my-auto flex flex-1 flex-row items-center justify-center">
            <Form.Field
              control={form.control}
              name="pipelineId"
              render={({ field }) => {
                return (
                  <input
                    className="w-[360px] bg-transparent py-2 text-semantic-bg-primary product-headings-heading-6 focus:outline-none focus:ring-0"
                    {...field}
                    value={field.value ?? "Untitled Pipeline"}
                    type="text"
                    autoComplete="off"
                    onBlur={() => {
                      form.handleSubmit(async (data) => {
                        if (data.pipelineId) {
                          console.log("submitting", data.pipelineId);
                          await handleRenamePipeline(data.pipelineId);
                        }
                      })();
                    }}
                  />
                );
              }}
            />
          </form>
        </Form.Root>
      </div>
    </div>
  );
};
