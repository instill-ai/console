import * as React from "react";
import * as z from "zod";
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
  PipelineBuilderStore,
  usePipelineBuilderStore,
} from "../usePipelineBuilderStore";
import { shallow } from "zustand/shallow";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateUserPipelineReleasePayload,
  Nullable,
  getInstillApiErrorMessage,
  useCreateUserPipelineRelease,
} from "../../../lib";
import { constructPipelineRecipe } from "../lib";
import { isAxiosError } from "axios";
import { LoadingSpin } from "../../../components";

const selector = (state: PipelineBuilderStore) => ({
  pipelineName: state.pipelineName,
  pipelineRecipeIsDirty: state.pipelineRecipeIsDirty,
  nodes: state.nodes,
  pipelineIsNew: state.pipelineIsNew,
});

export const ReleasePipelineFormSchema = z.object({
  id: z.string().min(1, { message: "Release Name is required" }),
  description: z.string().optional().nullable(),
});

export type ReleasePipelineModalProps = {
  accessToken: Nullable<string>;
  disabled?: boolean;
};

export const ReleasePipelineModal = ({
  accessToken,
  disabled,
}: ReleasePipelineModalProps) => {
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [isReleasing, setIsReleasing] = React.useState(false);

  const { toast } = useToast();

  const { pipelineName, nodes, pipelineRecipeIsDirty, pipelineIsNew } =
    usePipelineBuilderStore(selector, shallow);

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

          setModalIsOpen(false);
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
      open={modalIsOpen}
      onOpenChange={(e) => {
        form.reset({
          id: "",
          description: null,
        });
        setModalIsOpen(e);
      }}
    >
      <Dialog.Trigger asChild>
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              {/* 
                This will make tooltip work even with a disabled button
                https://www.radix-ui.com/primitives/docs/components/tooltip#displaying-a-tooltip-from-a-disabled-button
              */}
              {/* 
                eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
              */}
              <span className="flex" tabIndex={0}>
                <Button
                  variant="primary"
                  size="lg"
                  disabled={pipelineRecipeIsDirty || pipelineIsNew || disabled}
                  className={
                    pipelineRecipeIsDirty || pipelineIsNew
                      ? "pointer-events-none"
                      : ""
                  }
                  onClick={() => {
                    setModalIsOpen(true);
                  }}
                >
                  Release
                </Button>
              </span>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="!px-3 !py-2 rounded-sm !product-body-text-4-semibold bg-semantic-bg-primary">
                {pipelineRecipeIsDirty || pipelineIsNew
                  ? "Please save the pipeline first"
                  : "Release the pipeline"}
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
      </Dialog.Trigger>
      <Dialog.Content className="!max-w-[560px]">
        <div className="flex flex-col">
          <div className="flex flex-col mb-5">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-[10px] border border-semantic-bg-line">
              <Icons.CodeBrowser className="h-5 w-5 stroke-semantic-fg-primary" />
            </div>
            <div className="flex flex-col gap-y-1">
              <p className="product-body-text-1-semibold text-semantic-fg-primary">
                Release Pipeline
              </p>
              <p className="product-body-text-3-regular text-semantic-fg-disabled">
                Please enter a name and description for this release version.
              </p>
            </div>
          </div>
          <Form.Root {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col space-y-3 mb-8">
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
                    setModalIsOpen(false);
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
