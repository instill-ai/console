import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Catalog, Nullable } from "instill-sdk";
import { useForm } from "react-hook-form";
import z from "zod";

import {
  Button,
  cn,
  Form,
  Icons,
  Input,
  Separator,
} from "@instill-ai/design-system";

import { LoadingSpin } from "../../../../components";
import {
  InstillStore,
  toastInstillError,
  toastInstillSuccess,
  useGetNamespacePipelineRelease,
  useInstillStore,
  useShallow,
  useUpdateNamespaceCatalog,
} from "../../../../lib";

const EditCatalogConvertingPipelinesFormSchema = z.object({
  convertingPipelines: z.string().nullable(),
});

type EditCatalogConvertingPipelinesData = z.infer<
  typeof EditCatalogConvertingPipelinesFormSchema
>;

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const SettingsTab = ({
  catalog,
  namespaceId,
}: {
  catalog: Catalog;
  namespaceId: Nullable<string>;
}) => {
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));
  const [isConvertingPipelineValid, setIsConvertingPipelineValid] =
    React.useState(false);
  const [pipelineNamespace, setPipelineNamespace] = React.useState("");
  const [pipelineName, setPipelineName] = React.useState("");
  const [pipelineVersion, setPipelineVersion] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const updateCatalog = useUpdateNamespaceCatalog();

  const form = useForm<EditCatalogConvertingPipelinesData>({
    resolver: zodResolver(EditCatalogConvertingPipelinesFormSchema),
    defaultValues: {
      convertingPipelines:
        catalog.convertingPipelines.length > 0
          ? catalog.convertingPipelines[0]
          : "",
    },
    mode: "onSubmit",
  });

  const pipelineInputValue = form.watch("convertingPipelines");
  const pipelineRelease = useGetNamespacePipelineRelease({
    namespaceId: pipelineNamespace,
    accessToken,
    enabled:
      enabledQuery &&
      !!pipelineName &&
      !!pipelineVersion &&
      !!pipelineNamespace,
    pipelineId: pipelineName,
    releaseId: pipelineVersion,
    retry: false,
  });

  React.useEffect(() => {
    if (pipelineInputValue && !pipelineRelease.data) {
      form.setError("convertingPipelines", {
        message: "You must use a valid pipeline release",
      });
      setIsConvertingPipelineValid(false);
    } else {
      form.clearErrors("convertingPipelines");
      setIsConvertingPipelineValid(true);
    }
  }, [pipelineRelease.data, pipelineInputValue]);

  React.useEffect(() => {
    const pipelineNamespace = (pipelineInputValue || "").match(/.*\//);
    const pipelineNameAndVersion = (pipelineInputValue || "").match(
      /\/([\s\S]*)/,
    );

    if (Array.isArray(pipelineNamespace) && pipelineNamespace.length > 0) {
      setPipelineNamespace(pipelineNamespace[0].slice(0, -1));
    } else {
      setPipelineNamespace("");
    }

    if (
      Array.isArray(pipelineNameAndVersion) &&
      pipelineNameAndVersion.length > 1
    ) {
      const pipelineName = pipelineNameAndVersion[1]?.match(/.*@/);
      const pipelineVersion = pipelineNameAndVersion[1]?.match(/[^@]*$/);

      if (Array.isArray(pipelineName) && pipelineName[0]) {
        setPipelineName(pipelineName[0].slice(0, -1));
      } else {
        setPipelineName("");
      }

      if (Array.isArray(pipelineVersion) && pipelineVersion[0]) {
        setPipelineVersion(pipelineVersion[0]);
      } else {
        setPipelineVersion("");
      }
    } else {
      setPipelineName("");
      setPipelineVersion("");
    }
  }, [pipelineInputValue]);

  const onSubmit = React.useCallback(
    async (data: z.infer<typeof EditCatalogConvertingPipelinesFormSchema>) => {
      if (!namespaceId) {
        return;
      }

      setIsSubmitting(true);

      const payload = {
        convertingPipelines: [data.convertingPipelines || ""],
        namespaceId,
        catalogId: catalog.catalogId,
      };

      try {
        await updateCatalog.mutateAsync({
          payload,
          accessToken,
        });

        toastInstillSuccess({
          title: "Parsing pipeline has been succesfully updated",
        });
      } catch (error) {
        toastInstillError({
          title: "Something went wrong when onboarding your account",
          error,
        });
      } finally {
        setIsSubmitting(false);
      }

      return false;
    },
    [namespaceId, catalog],
  );

  const Icon = pipelineRelease.isFetching
    ? Icons.Repeat04
    : isConvertingPipelineValid
      ? Icons.CheckCircle
      : Icons.X;

  return (
    <div className="mb-32 flex flex-col">
      <div className="flex flex-col items-start justify-start gap-1 mb-2">
        <p className="text-semantic-fg-primary product-headings-heading-3">
          {catalog.name}
        </p>
      </div>
      <Separator orientation="horizontal" className="mb-6" />
      <p className="font-medium text-3xl mb-6">Parsing Configuration</p>
      <Form.Root {...form}>
        <form className="mb-2 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <Form.Field
            control={form.control}
            name="convertingPipelines"
            render={({ field }) => {
              return (
                <Form.Item className="items-start">
                  <Form.Label className="product-body-text-3-semibold">
                    Parsing Pipeline
                  </Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        type="text"
                        className="!product-body-text-2-regular min-w-96 pr-5"
                        value={field.value ?? ""}
                        autoComplete="off"
                      />
                      <Input.RightIcon>
                        <Icon
                          className={cn(
                            "h-4 w-4 mr-2",
                            isConvertingPipelineValid
                              ? "stroke-semantic-success-default"
                              : "stroke-semantic-fg-disabled",
                            pipelineRelease.isFetching ? "animate-spin" : "",
                          )}
                        />
                      </Input.RightIcon>
                    </Input.Root>
                  </Form.Control>
                  <Form.Message />
                  <Form.Description text="Specify a custom parsing pipeline for this catalog" />
                </Form.Item>
              );
            }}
          />
          <div className="flex flex-row items-center gap-x-4">
            <Button
              className="flex flex-row items-center gap-x-2"
              type="submit"
              variant="primary"
              size="lg"
              disabled={
                pipelineRelease.isFetching ||
                isSubmitting ||
                !isConvertingPipelineValid
              }
            >
              Update
              {isSubmitting ? <LoadingSpin className="w-4 h-4" /> : null}
            </Button>
            <Button
              variant="secondaryGrey"
              size="lg"
              disabled={
                pipelineRelease.isFetching ||
                isSubmitting ||
                !pipelineInputValue
              }
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();

                form.setValue("convertingPipelines", "");
                form.handleSubmit(onSubmit)();
              }}
            >
              Reset to default
            </Button>
          </div>
        </form>
      </Form.Root>
    </div>
  );
};
