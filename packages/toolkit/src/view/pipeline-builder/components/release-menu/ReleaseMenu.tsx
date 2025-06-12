"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateNamespacePipelineReleaseRequest } from "instill-sdk";
import { useForm, UseFormReturn } from "react-hook-form";
import * as z from "zod";

import { Button, Form } from "@instill-ai/design-system";

import { LoadingSpin } from "../../../../components";
import {
  InstillStore,
  toastInstillError,
  toastInstillSuccess,
  useCreateNamespacePipelineRelease,
  useInstillStore,
  useRouteInfo,
  useShallow,
} from "../../../../lib";
import { Description } from "./Description";
import { Head } from "./Head";
import { SemverSelect } from "./SemverSelect";

export const ReleasePipelineFormSchema = z.object({
  id: z.string(),
  description: z.string().optional().nullable(),
});

export type UseReleasePipelineFormReturn = UseFormReturn<
  z.infer<typeof ReleasePipelineFormSchema>,
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  any,
  z.infer<typeof ReleasePipelineFormSchema>
>;

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
});

export const ReleaseMenu = ({ onRelease }: { onRelease?: () => void }) => {
  const routeInfo = useRouteInfo();
  const [isReleasing, setIsReleasing] = React.useState(false);
  const form = useForm<z.infer<typeof ReleasePipelineFormSchema>>({
    resolver: zodResolver(ReleasePipelineFormSchema),
  });

  const { accessToken } = useInstillStore(useShallow(selector));

  const createPipelineRelease = useCreateNamespacePipelineRelease();

  const onSubmit = React.useCallback(
    async (data: z.infer<typeof ReleasePipelineFormSchema>) => {
      if (
        !routeInfo.isSuccess ||
        !routeInfo.data.namespaceId ||
        !routeInfo.data.resourceId
      ) {
        return;
      }

      const payload: CreateNamespacePipelineReleaseRequest = {
        pipelineId: routeInfo.data.resourceId,
        namespaceId: routeInfo.data.namespaceId,
        id: data.id,
        description: data.description ?? undefined,
      };

      try {
        await createPipelineRelease.mutateAsync({
          payload,
          accessToken,
        });

        form.reset({
          id: "",
          description: null,
        });

        toastInstillSuccess({
          title: "Successfully release pipeline",
        });

        setIsReleasing(false);

        if (onRelease) {
          onRelease();
        }
      } catch (error) {
        console.error(error);
        setIsReleasing(false);
        toastInstillError({
          title:
            "Something went wrong when release pipeline, please try again later",
          error,
        });
      }
    },
    [
      accessToken,
      form,
      onRelease,
      createPipelineRelease,
      setIsReleasing,
      routeInfo.isSuccess,
      routeInfo.data.pipelineName,
    ],
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
