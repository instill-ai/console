import * as React from "react";
import * as z from "zod";
import { Head } from "./Head";
import { SemverSelect } from "./SemverSelect";
import {
  CreateUserPipelineReleasePayload,
  InstillStore,
  toastInstillError,
  useCreateUserPipelineRelease,
  useInstillStore,
  useShallow,
} from "../../../../lib";
import { UseFormReturn, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, useToast } from "@instill-ai/design-system";
import { Description } from "./Description";
import { useRouter } from "next/router";
import { constructPipelineRecipe } from "../../lib";
import { LoadingSpin } from "../../../../components";

export const ReleasePipelineFormSchema = z.object({
  id: z.string(),
  description: z.string().optional().nullable(),
});

export type UseReleasePipelineFormReturn = UseFormReturn<
  z.infer<typeof ReleasePipelineFormSchema>,
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  any,
  undefined
>;

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  nodes: store.nodes,
});

export const ReleaseMenu = ({
  isReleasing,
  setIsReleasing,
  onRelease,
}: {
  isReleasing: boolean;
  setIsReleasing: (isReleasing: boolean) => void;
  onRelease: () => void;
}) => {
  const form = useForm<z.infer<typeof ReleasePipelineFormSchema>>({
    resolver: zodResolver(ReleasePipelineFormSchema),
  });

  const router = useRouter();
  const { id, entity } = router.query;
  const { toast } = useToast();
  const { accessToken, nodes } = useInstillStore(useShallow(selector));

  const releasePipelineVersion = useCreateUserPipelineRelease();

  const onSubmit = React.useCallback(
    async (data: z.infer<typeof ReleasePipelineFormSchema>) => {
      const payload: CreateUserPipelineReleasePayload = {
        id: data.id,
        description: data.description ?? undefined,
        recipe: constructPipelineRecipe(nodes),
      };

      try {
        await releasePipelineVersion.mutateAsync({
          pipelineName: `users/${entity}/pipelines/${id}`,
          payload,
          accessToken,
        });

        form.reset({
          id: "",
          description: null,
        });

        toast({
          title: "Successfully release pipeline",
          variant: "alert-success",
          size: "small",
        });

        setIsReleasing(false);
        onRelease();
      } catch (error) {
        setIsReleasing(false);
        toastInstillError({
          title:
            "Something went wrong when release pipeline, please try again later",
          toast,
          error,
        });
      }
    },
    [
      accessToken,
      entity,
      form,
      id,
      nodes,
      onRelease,
      releasePipelineVersion,
      setIsReleasing,
      toast,
    ]
  );

  return (
    <Form.Root {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-y-2">
          <Head />
          <SemverSelect form={form} />
          <Description form={form} />
          <Button className="ml-auto" type="submit" variant="primary" size="sm">
            {isReleasing ? <LoadingSpin /> : "Release"}
          </Button>
        </div>
      </form>
    </Form.Root>
  );
};
