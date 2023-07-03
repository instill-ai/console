import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Form,
  Icons,
  Select,
  useToast,
} from "@instill-ai/design-system";
import {
  ConnectorWithDefinition,
  ImageWithFallback,
  Nullable,
  testConnectorConnectionAction,
  useConnectorDefinitions,
} from "@instill-ai/toolkit";
import { useEffect, useState } from "react";
import { IncompleteConnectorWithWatchState } from "@/types";

export type SourceFormProps = {
  source: ConnectorWithDefinition | IncompleteConnectorWithWatchState;
  accessToken: Nullable<string>;
};

const SourceFormSchema = z.object({
  sourceDefinition: z.string(),
});

export const SourceForm = (props: SourceFormProps) => {
  const { source, accessToken } = props;

  const form = useForm<z.infer<typeof SourceFormSchema>>({
    resolver: zodResolver(SourceFormSchema),
    defaultValues: {
      sourceDefinition: source.connector_definition_name,
    },
  });

  const sourceDefinitions = useConnectorDefinitions({
    enabled: true,
    accessToken,
    connectorType: "CONNECTOR_TYPE_SOURCE",
  });

  useEffect(() => {
    form.reset({
      sourceDefinition: source.connector_definition_name,
    });
  }, [form, source]);

  const { toast } = useToast();

  const [isTesting, setIsTesting] = useState(false);

  const handleTestSource = async function () {
    if (!source) return;

    setIsTesting(true);

    try {
      const res = await testConnectorConnectionAction({
        connectorName: source.name,
        accessToken,
      });

      setIsTesting(false);

      toast({
        title: `${props.source.id} is ${
          res.state === "STATE_ERROR" ? "not connected" : "connected"
        }`,
        description: `The ${props.source.id} state is ${res.state}`,
        variant: res.state === "STATE_ERROR" ? "alert-error" : "alert-success",
        size: "large",
      });
    } catch (err) {
      setIsTesting(false);

      toast({
        title: "Error",
        description: `There is something wrong when test connection`,
        variant: "alert-error",
        size: "large",
      });
    }
  };

  return (
    <div className="flex w-full flex-col space-y-6">
      <Form.Root {...form}>
        <form className="flex w-full flex-col">
          <Form.Field
            control={form.control}
            name="sourceDefinition"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label htmlFor={field.name}>
                    Source definition
                  </Form.Label>
                  <Form.Control>
                    <Select.Root
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={true}
                    >
                      <Select.Trigger>
                        <Select.Value />
                      </Select.Trigger>
                      <Select.Content>
                        {sourceDefinitions.isSuccess
                          ? sourceDefinitions.data.map((definition) => (
                              <Select.Item
                                key={definition.name}
                                value={definition.name}
                              >
                                <div className="flex w-full flex-row gap-x-2">
                                  <ImageWithFallback
                                    src={`/icons/${definition.vendor}/${definition.icon}`}
                                    width={24}
                                    height={24}
                                    alt={`${definition.title}-icon`}
                                    fallbackImg={
                                      <Icons.Box className="h-6 w-6 stroke-semantic-fg-primary" />
                                    }
                                  />
                                  <p className="my-auto text-semantic-fg-primary product-body-text-2-regular">
                                    {definition.id}
                                  </p>
                                </div>
                              </Select.Item>
                            ))
                          : null}
                      </Select.Content>
                    </Select.Root>
                  </Form.Control>
                </Form.Item>
              );
            }}
          />
        </form>
      </Form.Root>
      <div className="flex w-full flex-row-reverse">
        <Button
          onClick={handleTestSource}
          className="gap-x-2"
          variant="primary"
          size="lg"
        >
          Test
          {isTesting ? (
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
            <Icons.Play className="h-4 w-4 stroke-semantic-fg-on-default" />
          )}
        </Button>
      </div>
    </div>
  );
};
