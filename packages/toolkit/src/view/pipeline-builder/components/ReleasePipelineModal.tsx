import * as React from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useShallow } from "zustand/react/shallow";
import { isAxiosError } from "axios";
import {
  Button,
  Dialog,
  Form,
  Icons,
  Input,
  Textarea,
  Tooltip,
  useToast,
} from "@instill-ai/design-system";

import {
  CreateUserPipelineReleasePayload,
  InstillStore,
  Nullable,
  getInstillApiErrorMessage,
  useCreateUserPipelineRelease,
  useInstillStore,
} from "../../../lib";
import { constructPipelineRecipe } from "../lib";
import { LoadingSpin } from "../../../components";

const selector = (store: InstillStore) => ({
  pipelineName: store.pipelineName,
  pipelineRecipeIsDirty: store.pipelineRecipeIsDirty,
  nodes: store.nodes,
  pipelineIsNew: store.pipelineIsNew,
});

export const ReleasePipelineFormSchema = z.object({
  id: z.string().min(1, { message: "Release Name is required" }),
  description: z.string().optional().nullable(),
});

export type ReleasePipelineModalProps = {
  accessToken: Nullable<string>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  disabled?: boolean;
};

export const ReleasePipelineModal = ({
  isOpen,
  setIsOpen,
  accessToken,
  disabled,
}: ReleasePipelineModalProps) => {
  const [isReleasing, setIsReleasing] = React.useState(false);

  const { toast } = useToast();

  const { pipelineName, nodes, pipelineRecipeIsDirty, pipelineIsNew } =
    useInstillStore(useShallow(selector));

  const form = useForm<z.infer<typeof ReleasePipelineFormSchema>>({
    resolver: zodResolver(ReleasePipelineFormSchema),
  });

  const releasePipelineVersion = useCreateUserPipelineRelease();

  function onSubmit(formData: z.infer<typeof ReleasePipelineFormSchema>) {
    if (!pipelineName || isReleasing) return;

    setIsReleasing(true);

    const payload: CreateUserPipelineReleasePayload = {
      id: formData.id,
      description: formData.description ?? undefined,
      recipe: constructPipelineRecipe(nodes),
    };

    releasePipelineVersion.mutate(
      {
        pipelineName,
        payload,
        accessToken,
      },
      {
        onSuccess: () => {
          form.reset({
            id: "",
            description: null,
          });

          toast({
            title: "Successfully release pipeline",
            variant: "alert-success",
            size: "small",
          });

          setIsOpen(false);
          setIsReleasing(false);
        },
        onError: (error) => {
          if (isAxiosError(error)) {
            toast({
              title: "Something went wrong when release pipeline",
              variant: "alert-error",
              size: "large",
              description: getInstillApiErrorMessage(error),
            });
          } else {
            toast({
              title: "Something went wrong when release pipeline",
              variant: "alert-error",
              size: "large",
              description: "Please try again later",
            });
          }
          setIsReleasing(false);
        },
      }
    );
  }

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(e) => {
        form.reset({
          id: "",
          description: null,
        });
        setIsOpen(e);
      }}
    >
      <Dialog.Content className="!max-w-[560px]">
        <div className="flex flex-col">
          <div className="mb-5 flex flex-col">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-[10px] border border-semantic-bg-line">
              <Icons.CodeBrowser className="h-5 w-5 stroke-semantic-fg-primary" />
            </div>
            <div className="flex flex-col gap-y-1">
              <p className="text-semantic-fg-primary product-body-text-1-semibold">
                Release Pipeline
              </p>
              <p className="text-semantic-fg-disabled product-body-text-3-regular">
                Please enter a name and description for this release version.
              </p>
            </div>
          </div>
          <Form.Root {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-8 flex flex-col space-y-3">
                <Form.Field
                  control={form.control}
                  name="id"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label>Release Name</Form.Label>
                        <Form.Control>
                          <Input.Root>
                            <Input.Core
                              {...field}
                              type="text"
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
                <Form.Field
                  control={form.control}
                  name="description"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label>Description</Form.Label>
                        <Form.Control>
                          <Textarea {...field} value={field.value ?? ""} />
                        </Form.Control>
                        <Form.Message />
                      </Form.Item>
                    );
                  }}
                />
              </div>
              <div className="flex w-full flex-row gap-x-4">
                <Button
                  type="button"
                  variant="secondaryGrey"
                  size="lg"
                  onClick={() => {
                    form.reset({
                      id: "",
                      description: null,
                    });
                    setIsOpen(false);
                  }}
                  className="!flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="!flex-1"
                  disabled={isReleasing}
                >
                  {isReleasing ? <LoadingSpin /> : "Release"}
                </Button>
              </div>
            </form>
          </Form.Root>
        </div>
        <Dialog.Close />
      </Dialog.Content>
    </Dialog.Root>
  );
};
