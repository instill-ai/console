import * as z from "zod";
import * as React from "react";
import {
  Button,
  Dialog,
  Form,
  Icons,
  Input,
  Logos,
  Select,
  Textarea,
} from "@instill-ai/design-system";

import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Nullable, useCreateApiToken } from "../../lib";

export type CreateOrganizationDialogProps = {
  accessToken: Nullable<string>;
  onCreate?: () => void;
};

const CreateTokenSchema = z.object({
  id: z.string().nonempty(),
});

export const CreateOrganizationDialog = (
  props: CreateOrganizationDialogProps
) => {
  const [open, setOpen] = React.useState(false);
  const { accessToken, onCreate } = props;
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof CreateTokenSchema>>({
    resolver: zodResolver(CreateTokenSchema),
    defaultValues: {
      id: "",
    },
  });

  const createAPIToken = useCreateApiToken();
  const handleCreateAPIToken = (data: z.infer<typeof CreateTokenSchema>) => {
    if (!accessToken) return;

    const payload = {
      id: data.id,
      ttl: -1,
    };

    setIsLoading(true);

    createAPIToken.mutate(
      { payload, accessToken },
      {
        onSuccess: () => {
          setIsLoading(false);
          if (onCreate) {
            onCreate();
          }

          setOpen(false);
        },
        onError: (err) => {
          setIsLoading(false);
          if (isAxiosError(err)) {
            if (err.response?.status === 409) {
              form.setError("id", {
                type: "manual",
                message: "Token name already exists",
              });
              return;
            }
            form.setError("id", {
              type: "manual",
              message: err.response?.data.message,
            });
          }
        },
      }
    );
  };

  return (
    <Dialog.Root open={open} onOpenChange={(open) => setOpen(open)}>
      <Dialog.Trigger asChild>
        <Button variant="primary" size="lg">
          Create Organization
        </Button>
      </Dialog.Trigger>
      <Dialog.Content className="!w-[650px]">
        <Dialog.Header>
          <Dialog.Title>
            <div className="flex flex-row gap-x-4">
              <div className="my-auto rounded-lg bg-white p-3">
                <Logos.OpenAI className="h-6 w-6" />
              </div>
              <p className="my-auto product-headings-heading-1">
                New Organisation
              </p>
            </div>
          </Dialog.Title>
        </Dialog.Header>

        <div className="flex w-full flex-row gap-x-4">
          <div className="w-1/2 space-y-2">
            <p className="product-body-text-2-semibold">
              Organisation username
            </p>
            <Input.Root>
              <Input.Core disabled={false} type="text" placeholder="Username" />
            </Input.Root>
          </div>

          <div className="w-1/2 space-y-2">
            <p className="product-body-text-2-semibold">
              Organisation Full name
            </p>
            <Input.Root>
              <Input.Core
                disabled={false}
                type="text"
                placeholder="Full name"
              />
            </Input.Root>
          </div>
        </div>

        <div className="w-full space-y-3">
          <p className="product-body-text-1-semibold">Upload your logo</p>
          <div className="my-auto space-y-3 rounded border border-dashed bg-slate-50 px-10 py-10 text-center">
            <Icons.Upload01 className="mx-auto h-8 w-8 stroke-slate-500" />
            <p className="mx-auto product-body-text-4-regular">
              Drag-and-drop file, or browse computer
            </p>
          </div>
        </div>
        <div className="flex w-full flex-row gap-x-4">
          <div className="w-1/2 space-y-2">
            <p className="product-body-text-2-semibold">Organisation type</p>
            <Select.Root>
              <Select.Trigger className="w-full">
                <Select.Value placeholder="Select.." />
              </Select.Trigger>
              <Select.Content>
                <Select.Group>
                  <Select.Label>Organisation 1</Select.Label>
                  <Select.Item value="organisation-1">Organisation</Select.Item>
                  <Select.Item value="organisation-2">Organisation</Select.Item>
                  <Select.Item value="organisation-3">Organisation</Select.Item>
                  <Select.Item value="organisation-4">Organisation</Select.Item>
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </div>

          <div className="w-1/2 space-y-2">
            <p className="product-body-text-2-semibold">Homepage</p>
            <Input.Root>
              <Input.Core
                disabled={false}
                type="text"
                placeholder="Full name"
              />
            </Input.Root>
          </div>
        </div>
        <div className="flex w-full flex-row gap-x-4">
          <div className="w-1/2 space-y-2">
            <p className="product-body-text-2-semibold">Github username</p>
            <Input.Root>
              <Input.Core disabled={false} type="text" placeholder="Username" />
            </Input.Root>
          </div>

          <div className="w-1/2 space-y-2">
            <p className="product-body-text-2-semibold">Twitter username</p>
            <Input.Root>
              <Input.Core
                disabled={false}
                type="text"
                placeholder="Full name"
              />
            </Input.Root>
          </div>
        </div>

        <div className="w-full space-y-2">
          <p className="product-body-text-2-semibold">Organisation bio</p>
          <Textarea placeholder="Content" value="" />
        </div>

        <Dialog.Footer className="mt-8">
          <Button variant="primary" size="lg" className="w-full">
            Create Organisation
          </Button>
        </Dialog.Footer>

        <Dialog.Close />
      </Dialog.Content>
    </Dialog.Root>
  );
};
