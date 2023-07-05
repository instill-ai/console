import {
  Button,
  Dialog,
  Form,
  Input,
  LinkButton,
  Separator,
  Textarea,
  useToast,
} from "@instill-ai/design-system";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Nullable,
  getInstillApiErrorMessage,
  useDeletePipeline,
  usePipeline,
} from "@instill-ai/toolkit";
import { useEffect, useState } from "react";
import { PipelineBuilderStore, usePipelineBuilderStore } from "@/stores";
import { useRouter } from "next/router";
import { shallow } from "zustand/shallow";
import { isAxiosError } from "axios";

export const pipelineFormSchema = z.object({
  id: z.string(),
  description: z.string().optional(),
});

export const deletePipelineFormSchema = z.object({
  confirmationCode: z.string().optional(),
});

export type PipelineForm = {
  accessToken: Nullable<string>;
};

const pipelineBuilderSelector = (state: PipelineBuilderStore) => ({
  pipelineId: state.pipelineId,
  setPipelineId: state.setPipelineId,
  setPipelineDescription: state.setPipelineDescription,
});

export const PipelineForm = (props: PipelineForm) => {
  const { accessToken } = props;
  const router = useRouter();
  const updatePipelineform = useForm<z.infer<typeof pipelineFormSchema>>({
    resolver: zodResolver(pipelineFormSchema),
  });

  const deletePipelineForm = useForm<z.infer<typeof deletePipelineFormSchema>>({
    resolver: zodResolver(deletePipelineFormSchema),
  });

  const { id } = router.query;

  const pipeline = usePipeline({
    pipelineName: `pipelines/${id}`,
    enabled: !!id,
    accessToken,
  });

  const { pipelineId, setPipelineId, setPipelineDescription } =
    usePipelineBuilderStore(pipelineBuilderSelector, shallow);

  useEffect(() => {
    updatePipelineform.reset({
      id: router.asPath.split("/")[2],
    });
  }, [router.isReady, router.asPath, updatePipelineform]);

  useEffect(() => {
    if (!pipeline.isSuccess) return;
    updatePipelineform.reset({
      id: pipeline.data.id,
      description: pipeline.data.description,
    });
  }, [pipeline.data, pipeline.isSuccess, updatePipelineform]);

  useEffect(() => {
    if (!pipelineId) return;
    updatePipelineform.reset((prev) => {
      return {
        ...prev,
        id: pipelineId,
      };
    });
  }, [pipelineId, updatePipelineform]);

  const deletePipeline = useDeletePipeline();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  function handleDeletePipeline() {
    if (!pipeline.isSuccess) return;

    setIsDeleting(true);

    deletePipeline.mutate(
      { pipelineName: pipeline.data.name, accessToken },
      {
        onSuccess: () => {
          setIsDeleting(false);
          router.push("/pipelines");
        },
        onError: (error) => {
          setIsDeleting(false);
          if (isAxiosError(error)) {
            toast({
              title: "Something went wrong when delete the pipeline",
              description: getInstillApiErrorMessage(error),
              variant: "alert-error",
              size: "large",
            });
          } else {
            toast({
              title: "Something went wrong when delete the pipeline",
              variant: "alert-error",
              description: "Please try again later",
              size: "large",
            });
          }
        },
      }
    );
  }

  return (
    <div className="flex w-full flex-col">
      <Form.Root {...updatePipelineform}>
        <form className="mb-10 flex w-full flex-col">
          <div className="flex flex-col space-y-5">
            <Form.Field
              control={updatePipelineform.control}
              name="id"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>ID *</Form.Label>
                    <Form.Control>
                      <Input.Root className="!rounded-none">
                        <Input.Core
                          {...field}
                          type="text"
                          placeholder="Pipeline's name"
                          value={field.value ?? ""}
                          autoComplete="off"
                          disabled={false}
                          onChange={(e) => {
                            field.onChange(e);
                            console.log("input", e.target.value);
                            setPipelineId(e.target.value);
                          }}
                        />
                      </Input.Root>
                    </Form.Control>
                  </Form.Item>
                );
              }}
            />
            <Form.Field
              control={updatePipelineform.control}
              name="description"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>Description</Form.Label>
                    <Form.Control>
                      <Textarea
                        {...field}
                        id={field.name}
                        value={field.value ?? ""}
                        className="!rounded-none"
                        onChange={(e) => {
                          field.onChange(e);
                          setPipelineDescription(e.target.value);
                        }}
                      />
                    </Form.Control>
                    <Form.Description>
                      Fill with a short description.
                    </Form.Description>
                    <Form.Message />
                  </Form.Item>
                );
              }}
            />
          </div>
        </form>
      </Form.Root>
      <Dialog.Root>
        <Dialog.Trigger className="mb-10" asChild>
          <Button
            disabled={pipeline.isSuccess ? false : true}
            variant="danger"
            size="lg"
          >
            Delete
          </Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title className="!product-headings-heading-1">
              Delete Pipeline
            </Dialog.Title>
            <Dialog.Description>
              This action cannot be undone. This will permanently delete the
              source.
            </Dialog.Description>
          </Dialog.Header>
          <div className="flex flex-col space-y-2">
            <Form.Root {...deletePipelineForm}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
                className="flex w-full flex-col"
              >
                <div className="mb-5 flex flex-col space-y-5">
                  <Form.Field
                    control={deletePipelineForm.control}
                    name="confirmationCode"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label>
                            Please type
                            <span className="mx-1 select-all font-bold">{` ${pipeline.data?.id} `}</span>
                            to confirm.
                          </Form.Label>
                          <Form.Control>
                            <Input.Root className="!rounded-none">
                              <Input.Core
                                {...field}
                                type="text"
                                value={field.value ?? ""}
                                autoComplete="off"
                                disabled={false}
                              />
                            </Input.Root>
                          </Form.Control>
                        </Form.Item>
                      );
                    }}
                  />
                </div>
                <Button
                  disabled={
                    pipeline.isSuccess
                      ? deletePipelineForm.watch("confirmationCode") ===
                        pipeline.data?.id
                        ? isDeleting
                          ? true
                          : false
                        : true
                      : true
                  }
                  variant="danger"
                  size="lg"
                  type="button"
                  onClick={() => handleDeletePipeline()}
                >
                  {isDeleting ? (
                    <svg
                      className="m-auto h-4 w-4 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  ) : (
                    "Delete"
                  )}
                </Button>
              </form>
            </Form.Root>
          </div>
        </Dialog.Content>
      </Dialog.Root>
      <div className="relative mb-6 w-full">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-semantic-bg-primary px-2">
          <p className="text-semantic-fg-secondary product-body-text-2-medium">
            Trigger the pipeline
          </p>
        </div>
        <Separator orientation="horizontal" />
      </div>
      <div className="flex flex-col space-y-2">
        <p className="text-semantic-fg-secondary product-body-text-2-regular">
          Go to
          <span className="font-bold">{` Settings > API `}</span>
          Token to create an API token and replace
          <span className="font-bold">{` YOUR_API_TOKEN `}</span>in the REST
          requests.
        </p>
        <div>
          <LinkButton variant="primary" size="md">
            <a
              href="https://www.instill.tech/docs/core-concepts/pipeline"
              target="_blank"
              rel="noopener noreferrer"
            >
              See documentation
            </a>
          </LinkButton>
        </div>
      </div>
    </div>
  );
};
