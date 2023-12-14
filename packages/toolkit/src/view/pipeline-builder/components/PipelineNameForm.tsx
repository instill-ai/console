import cn from "clsx";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import * as z from "zod";
import { useRouter } from "next/router";
import { Form, Icons, useToast } from "@instill-ai/design-system";
import { useShallow } from "zustand/react/shallow";

import {
  CreateUserPipelinePayload,
  InstillStore,
  Nullable,
  RenameUserPipelinePayload,
  UpdateUserPipelinePayload,
  checkNamespace,
  getInstillApiErrorMessage,
  useCreateUserPipeline,
  useEntity,
  useInstillStore,
  useRenameUserPipeline,
  useUpdateUserPipeline,
} from "../../../lib";
import {
  composePipelineMetadataFromNodes,
  constructPipelineRecipe,
} from "../lib";
import { AutoresizeInputWrapper } from "../../../components";

const selector = (store: InstillStore) => ({
  pipelineId: store.pipelineId,
  setPipelineId: store.setPipelineId,
  setPipelineUid: store.setPipelineUid,
  setPipelineName: store.setPipelineName,
  nodes: store.nodes,
  pipelineIsNew: store.pipelineIsNew,
  testModeEnabled: store.testModeEnabled,
  updatePipelineIsNew: store.updatePipelineIsNew,
  pipelineRecipeIsDirty: store.pipelineRecipeIsDirty,
  updatePipelineRecipeIsDirty: store.updatePipelineRecipeIsDirty,
});

export type PipelineNameFormProps = {
  accessToken: Nullable<string>;
  enableQuery: boolean;
};

export const UpdatePipelineIdSchema = z.object({
  pipelineId: z.string().nullable().optional(),
});

export const PipelineNameForm = (props: PipelineNameFormProps) => {
  const { accessToken } = props;
  const router = useRouter();
  const { entity, id } = router.query;

  const entityObject = useEntity();

  const { toast } = useToast();

  const pipelineNameRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof UpdatePipelineIdSchema>>({
    resolver: zodResolver(UpdatePipelineIdSchema),
    mode: "onBlur",
  });

  const {
    formState: { isDirty },
  } = form;

  const {
    pipelineId,
    setPipelineId,
    setPipelineUid,
    setPipelineName,
    pipelineIsNew,
    testModeEnabled,
    nodes,
    updatePipelineIsNew,
    pipelineRecipeIsDirty,
    updatePipelineRecipeIsDirty,
  } = useInstillStore(useShallow(selector));

  React.useEffect(() => {
    form.reset({
      pipelineId: router.asPath.split("/")[3],
    });
  }, [router.isReady, router.asPath, form]);

  React.useEffect(() => {
    if (!pipelineId) return;
    form.reset({
      pipelineId,
    });
  }, [pipelineId, form]);

  const createUserPipeline = useCreateUserPipeline();
  const updateUserPipeline = useUpdateUserPipeline();
  const renameUserPipeline = useRenameUserPipeline();

  async function handleRenamePipeline(newId: string) {
    if (!pipelineId || !entityObject.isSuccess || !accessToken) {
      return;
    }

    if (pipelineIsNew) {
      const payload: CreateUserPipelinePayload = {
        id: newId,
        recipe: constructPipelineRecipe(nodes),
        metadata: composePipelineMetadataFromNodes(nodes),
      };

      try {
        const res = await createUserPipeline.mutateAsync({
          entityName: entityObject.entityName,
          payload,
          accessToken,
        });

        // We should change all the state before pushing to the new route

        setPipelineId(newId);
        setPipelineUid(res.pipeline.uid);
        setPipelineName(res.pipeline.name);
        updatePipelineIsNew(() => false);
        updatePipelineRecipeIsDirty(() => false);

        await router.push(`/${entity}/pipelines/${newId}`, undefined, {
          shallow: true,
        });

        toast({
          title: "Successfully saved the pipeline",
          variant: "alert-success",
          size: "small",
        });
      } catch (error) {
        form.reset({
          pipelineId,
        });
        if (isAxiosError(error)) {
          toast({
            title: "Something went wrong when save the pipeline",
            description: getInstillApiErrorMessage(error),
            variant: "alert-error",
            size: "large",
          });
        } else {
          toast({
            title: "Something went wrong when save the pipeline",
            variant: "alert-error",
            size: "large",
          });
        }
      }

      return;
    }

    // If the pipeline recipe is dirty, we should update the pipeline recipe
    // first then rename the pipeline

    if (pipelineRecipeIsDirty) {
      const payload: UpdateUserPipelinePayload = {
        name: entityObject.pipelineName,
        recipe: constructPipelineRecipe(nodes),
        metadata: composePipelineMetadataFromNodes(nodes),
      };

      try {
        await updateUserPipeline.mutateAsync({
          payload,
          accessToken,
        });

        updatePipelineRecipeIsDirty(() => false);
      } catch (error) {
        form.reset({
          pipelineId,
        });
        if (isAxiosError(error)) {
          toast({
            title: "Something went wrong when save the pipeline",
            description: getInstillApiErrorMessage(error),
            variant: "alert-error",
            size: "large",
          });
        } else {
          toast({
            title: "Something went wrong when save the pipeline",
            variant: "alert-error",
            size: "large",
          });
        }
        return;
      }
    }

    const payload: RenameUserPipelinePayload = {
      name: entityObject.pipelineName,
      new_pipeline_id: newId,
    };

    try {
      await renameUserPipeline.mutateAsync({
        payload: payload,
        accessToken,
      });

      await router.push(`/${entity}/pipelines/${newId}`, undefined, {
        shallow: true,
      });

      toast({
        title: "Sussessfully renamed the pipeline",
        variant: "alert-success",
        size: "small",
      });

      setPipelineId(newId);
      setPipelineName(`${entityObject.entityName}/pipelines/${newId}`);
    } catch (error) {
      form.reset({
        pipelineId,
      });
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
        <button
          onClick={() => {
            if (pipelineIsNew) {
              router.push(`/${entity}/pipelines`);
            } else {
              router.push(`/${entity}/pipelines/${id}`);
            }
          }}
          className="flex cursor-pointer flex-row gap-x-3"
        >
          <Icons.ArrowLeft className="my-auto h-5 w-5 stroke-semantic-fg-secondary" />
          <p className="my-auto text-semantic-fg-secondary product-body-text-3-medium">
            Pipelines
          </p>
        </button>
        <p className="my-auto pb-0.5 text-semantic-fg-secondary product-headings-heading-6">
          /
        </p>
        <Form.Root {...form}>
          <form className="my-auto flex flex-1 flex-row items-center justify-center">
            <Form.Field
              control={form.control}
              name="pipelineId"
              render={({ field }) => {
                const textStyle =
                  "text-semantic-fg-primary product-body-text-3-semibold";

                return (
                  <div className="flex flex-row gap-x-2">
                    <AutoresizeInputWrapper
                      value={field.value ?? ""}
                      className="h-9 max-w-[400px]"
                      placeholderClassname={cn("p-2", textStyle)}
                    >
                      <input
                        {...field}
                        ref={pipelineNameRef}
                        className={cn(
                          "!absolute !bottom-0 !left-0 !right-0 !top-0 bg-transparent p-2 focus:!ring-1 focus:!ring-semantic-accent-default",
                          textStyle
                        )}
                        value={field.value ?? "Untitled Pipeline"}
                        type="text"
                        autoComplete="off"
                        onBlur={() => {
                          form.handleSubmit(async (data) => {
                            if (!data.pipelineId || data.pipelineId === "") {
                              form.reset({
                                pipelineId:
                                  pipelineId ?? router.asPath.split("/")[2],
                              });
                              return;
                            }

                            if (data.pipelineId && isDirty) {
                              await handleRenamePipeline(data.pipelineId);
                            }
                          })();
                        }}
                        onClick={(e) => e.stopPropagation()}
                        disabled={testModeEnabled}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            e.stopPropagation();
                            form.handleSubmit(async (data) => {
                              if (!data.pipelineId || data.pipelineId === "") {
                                form.reset({
                                  pipelineId:
                                    pipelineId ?? router.asPath.split("/")[2],
                                });
                                return;
                              }

                              if (data.pipelineId && isDirty) {
                                await handleRenamePipeline(data.pipelineId);
                              }
                            })();
                          }
                        }}
                      />
                    </AutoresizeInputWrapper>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        pipelineNameRef.current?.focus();
                      }}
                      type="button"
                    >
                      <Icons.Edit03 className="h-4 w-4 stroke-semantic-fg-primary" />
                    </button>
                  </div>
                );
              }}
            />
          </form>
        </Form.Root>
        {pipelineRecipeIsDirty ? (
          <p className="my-auto text-semantic-fg-disabled product-body-text-4-regular">{`(unsaved)`}</p>
        ) : null}
      </div>
    </div>
  );
};
