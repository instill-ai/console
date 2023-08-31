import * as z from "zod";
import * as React from "react";

import { Form, Icons, Input, Switch } from "@instill-ai/design-system";
import { Nullable } from "@instill-ai/toolkit";
import { UseFormReturn, useForm } from "react-hook-form";
import { Node } from "reactflow";
import { NodeData, StartNodeData } from "./type";
import { zodResolver } from "@hookform/resolvers/zod";

export type StartOperatorInputBody = Record<string, StartOperatorInput>;

export type StartOperatorInputBodyValue = Record<string, any>;

export type StartOperatorInput = {
  title: string;
  type: "text" | "number" | "boolean" | "audio" | "image";
};

export const useStartOperatorTestModeInputForm = (props: {
  nodes: Node<NodeData>[];
}) => {
  const { nodes } = props;

  const Schema = React.useMemo(() => {
    // We can guarantee that there is one start node
    const startNode = nodes.find(
      (node) => node.data.nodeType === "start"
    ) as Node<StartNodeData>;

    return transformStartOperatorBodyToZod(
      startNode.data.component.configuration.body
    );
  }, [nodes]);

  const form = useForm<z.infer<typeof Schema>>({
    resolver: zodResolver(Schema),
  });

  const fields = React.useMemo(() => {
    const startNode = nodes.find(
      (node) => node.data.nodeType === "start"
    ) as Node<StartNodeData>;

    return transformStartOperatorBodyToField(
      startNode.data.component.configuration.body,
      form
    );
  }, [nodes, form]);

  return {
    form,
    Schema,
    fields,
  };
};

export function transformStartOperatorBodyToZod(data: StartOperatorInputBody) {
  let zodSchema: z.ZodObject<any, any, any> = z.object({});

  for (const [key, value] of Object.entries(data)) {
    switch (value.type) {
      case "text":
        zodSchema = zodSchema.setKey(key, z.string().nullable().optional());
        break;
      case "boolean":
        zodSchema = zodSchema.setKey(key, z.boolean().nullable().optional());
        break;
      case "number":
        zodSchema = zodSchema.setKey(
          key,
          z.coerce
            .number()
            .positive({ message: "Value must be positive" })
            .nullable()
            .optional()
        );
        break;
      case "audio":
        zodSchema = zodSchema.setKey(
          key,
          z.instanceof(File).nullable().optional()
        );
        break;
      case "image":
        zodSchema = zodSchema.setKey(
          key,
          z.instanceof(File).nullable().optional()
        );
        break;
      default:
        break;
    }
  }

  return zodSchema;
}

export function transformStartOperatorBodyToField(
  data: StartOperatorInputBody,
  form: UseFormReturn<{ [k: string]: any }, any, undefined>
) {
  const fields: React.ReactElement[] = [];

  for (const [key, value] of Object.entries(data)) {
    switch (value.type) {
      case "text":
        fields.push(<StringField form={form} fieldKey={key} value={value} />);
        break;
      case "boolean":
        fields.push(<BooleanField form={form} fieldKey={key} value={value} />);
        break;
      case "number":
        fields.push(<NumberField form={form} fieldKey={key} value={value} />);
        break;
      case "audio":
        fields.push(<AudioField form={form} fieldKey={key} value={value} />);
        break;
      case "image":
        fields.push(<ImageField form={form} fieldKey={key} value={value} />);
        break;
      default:
        break;
    }
  }

  return fields;
}

const StringField = (props: {
  form: UseFormReturn<{ [k: string]: any }, any, undefined>;
  fieldKey: string;
  value: StartOperatorInput;
}) => {
  const { form, fieldKey, value } = props;
  return (
    <Form.Field
      control={form.control}
      name={fieldKey}
      render={({ field }) => {
        return (
          <Form.Item>
            <Form.Label className="text-semantic-fg-primary product-body-text-3-semibold">
              {value.title}
            </Form.Label>
            <Form.Control>
              <Input.Root>
                <Input.Core
                  {...field}
                  type="text"
                  value={field.value ?? ""}
                  autoComplete="off"
                  // AlphaValueIssue: We still have alpha value issue in
                  // out design-token, so we need to use the hex value
                  // here
                  className="!text-[#1D2433] !text-opacity-80 !product-body-text-3-regular"
                />
              </Input.Root>
            </Form.Control>
            <Form.Message />
          </Form.Item>
        );
      }}
    />
  );
};

const NumberField = (props: {
  form: UseFormReturn<{ [k: string]: any }, any, undefined>;
  fieldKey: string;
  value: StartOperatorInput;
}) => {
  const { form, fieldKey, value } = props;
  return (
    <Form.Field
      control={form.control}
      name={fieldKey}
      render={({ field }) => {
        return (
          <Form.Item>
            <Form.Label className="text-semantic-fg-primary product-body-text-3-semibold">
              {value.title}
            </Form.Label>
            <Form.Control>
              <Input.Root>
                <Input.Core
                  {...field}
                  type="number"
                  value={field.value ?? ""}
                  autoComplete="off"
                  // AlphaValueIssue: We still have alpha value issue in
                  // out design-token, so we need to use the hex value
                  // here
                  className="!text-[#1D2433] !text-opacity-80 !product-body-text-3-regular"
                />
              </Input.Root>
            </Form.Control>
            <Form.Message />
          </Form.Item>
        );
      }}
    />
  );
};

const BooleanField = (props: {
  form: UseFormReturn<{ [k: string]: any }, any, undefined>;
  fieldKey: string;
  value: StartOperatorInput;
}) => {
  const { form, fieldKey, value } = props;
  return (
    <Form.Field
      control={form.control}
      name={fieldKey}
      render={({ field }) => {
        return (
          <Form.Item>
            <Form.Label className="text-semantic-fg-primary product-body-text-3-semibold">
              {value.title}
            </Form.Label>
            <Form.Control>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </Form.Control>
            <Form.Message />
          </Form.Item>
        );
      }}
    />
  );
};

const AudioField = (props: {
  form: UseFormReturn<{ [k: string]: any }, any, undefined>;
  fieldKey: string;
  value: StartOperatorInput;
}) => {
  const { form, fieldKey, value } = props;
  const [audioFileUrl, setAudioFileUrl] =
    React.useState<Nullable<string>>(null);

  return (
    <Form.Field
      key={fieldKey}
      control={form.control}
      name={fieldKey}
      render={({ field }) => {
        return (
          <Form.Item>
            <div className="flex flex-row justify-between">
              <Form.Label className="text-semantic-fg-primary product-body-text-3-semibold">
                {value.title}
              </Form.Label>
              <label
                htmlFor={`start-operator-${fieldKey}`}
                className="cursor-pointer capitalize text-semantic-accent-default !underline product-button-button-3"
              >
                upload file
              </label>
            </div>

            <audio controls={true} src={audioFileUrl ?? undefined} />

            <Form.Control>
              <Input.Root className="hidden">
                <Input.Core
                  id={`start-operator-${fieldKey}`}
                  type="file"
                  accept="audio/*"
                  // DesignToken-AlphaValueIssue:
                  onChange={(e) => {
                    field.onChange(e.target.files ? e.target.files[0] : null);
                    if (e.target.files) {
                      setAudioFileUrl(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                />
              </Input.Root>
            </Form.Control>
            <Form.Message />
          </Form.Item>
        );
      }}
    />
  );
};

const ImageField = (props: {
  form: UseFormReturn<{ [k: string]: any }, any, undefined>;
  fieldKey: string;
  value: StartOperatorInput;
}) => {
  const { form, fieldKey, value } = props;

  const [imageFileUrl, setImageFileUrl] =
    React.useState<Nullable<string>>(null);

  return (
    <Form.Field
      key={fieldKey}
      control={form.control}
      name={fieldKey}
      render={({ field }) => {
        return (
          <Form.Item>
            <Form.Label className="text-semantic-fg-primary product-body-text-3-semibold">
              {value.title}
            </Form.Label>
            <Form.Control>
              <label
                htmlFor={`start-operator-${fieldKey}`}
                className="flex h-[150px] w-full cursor-pointer flex-col rounded bg-semantic-bg-base-bg"
              >
                {imageFileUrl ? (
                  <img
                    className="h-full w-full object-contain"
                    src={imageFileUrl}
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-y-2">
                    <Icons.Upload01 className="h-8 w-8 stroke-semantic-fg-secondary" />
                    <p className="text-semantic-fg-primary product-body-text-4-regular">
                      Upload Image
                    </p>
                  </div>
                )}
                <Input.Root className="hidden">
                  <Input.Core
                    id={`start-operator-${fieldKey}`}
                    type="file"
                    accept="images/*"
                    // DesignToken-AlphaValueIssue:
                    onChange={(e) => {
                      field.onChange(e.target.files ? e.target.files[0] : null);
                      if (e.target.files) {
                        setImageFileUrl(URL.createObjectURL(e.target.files[0]));
                      }
                    }}
                  />
                </Input.Root>
              </label>
            </Form.Control>
            <Form.Message />
          </Form.Item>
        );
      }}
    />
  );
};
