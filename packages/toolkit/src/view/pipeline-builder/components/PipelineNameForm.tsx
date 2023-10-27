import cn from "clsx";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import * as z from "zod";
import { shallow } from "zustand/shallow";
import Link from "next/link";
import { useRouter } from "next/router";
import { Form, Icons, useToast } from "@instill-ai/design-system";

import {
  PipelineBuilderStore,
  usePipelineBuilderStore,
} from "../usePipelineBuilderStore";
import {
  CreateUserPipelinePayload,
  Nullable,
  RenameUserPipelinePayload,
  UpdateUserPipelinePayload,
  getInstillApiErrorMessage,
  useCreateUserPipeline,
  useRenameUserPipeline,
  useUpdateUserPipeline,
} from "../../../lib";
import { constructPipelineRecipe, createInitialGraphData } from "../lib";
import { AutoresizeInputWrapper } from "../../../components";

const pipelineBuilderSelector = (state: PipelineBuilderStore) => ({
  pipelineId: state.pipelineId,
  setPipelineId: state.setPipelineId,
  setPipelineUid: state.setPipelineUid,
  setPipelineName: state.setPipelineName,
  nodes: state.nodes,
  updateNodes: state.updateNodes,
  updateEdges: state.updateEdges,
  pipelineIsNew: state.pipelineIsNew,
  testModeEnabled: state.testModeEnabled,
  updatePipelineIsNew: state.updatePipelineIsNew,
  pipelineRecipeIsDirty: state.pipelineRecipeIsDirty,
  updatePipelineRecipeIsDirty: state.updatePipelineRecipeIsDirty,
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
  const { entity } = router.query;

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
    updateNodes,
    updateEdges,
    updatePipelineIsNew,
    pipelineRecipeIsDirty,
    updatePipelineRecipeIsDirty,
  } = usePipelineBuilderStore(pipelineBuilderSelector, shallow);

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
    if (!pipelineId) {
      return;
    }

    // If pipeline is new, we dircetly create the pipeline

    if (pipelineIsNew) {
      const payload: CreateUserPipelinePayload = {
        id: newId,
        recipe: constructPipelineRecipe(nodes),
      };

      try {
        const res = await createUserPipeline.mutateAsync({
          userName: `users/${entity}`,
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
        name: `users/${entity}/pipelines/${pipelineId}`,
        recipe: constructPipelineRecipe(nodes),
      };

      try {
        const res = await updateUserPipeline.mutateAsync({
          payload,
          accessToken,
        });

        updatePipelineRecipeIsDirty(() => false);

        const { nodes, edges } = createInitialGraphData(res.pipeline.recipe);

        updateNodes(() => nodes);
        updateEdges(() => edges);
      } catch (error) {
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
      name: `users/${entity}/pipelines/${pipelineId}`,
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
      setPipelineName(`users/${entity}/pipelines/${newId}`);
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
        <Link className="flex flex-row gap-x-3" href={`/${entity}/pipelines`}>
          <Icons.ArrowLeft className="my-auto h-5 w-5 stroke-semantic-fg-secondary" />
          <p className="my-auto text-semantic-fg-secondary product-body-text-3-medium">
            Pipelines
          </p>
        </Link>
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
