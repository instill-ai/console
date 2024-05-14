"use client";

import * as z from "zod";
import * as React from "react";
import {
  Button,
  Dialog,
  Form,
  Input,
  useToast,
} from "@instill-ai/design-system";
import {
  getInstillApiErrorMessage,
  sendAmplitudeData,
  useAmplitudeCtx,
  useDeleteUserSecret,
  useInstillStore,
} from "../../../lib";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingSpin } from "../../../components";

const DeleteSecretSchema = z.object({
  code: z.string().min(1, "Code is required"),
});

export const DeleteSecretDialog = ({ secretName }: { secretName: string }) => {
  const { amplitudeIsInit } = useAmplitudeCtx();
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const accessToken = useInstillStore((store) => store.accessToken);

  const displaySecretName = secretName.split("/").pop() || "";

  const displaySecretName = secretName.split("/").pop() || "";

  const form = useForm<z.infer<typeof DeleteSecretSchema>>({
    resolver: zodResolver(DeleteSecretSchema),
    defaultValues: {
      code: "",
    },
  });

  const { toast } = useToast();

  const deleteSecret = useDeleteUserSecret();

  const handleDeleteApiToken = async () => {
    if (!accessToken) return;
    setIsLoading(true);

    try {
      await deleteSecret.mutateAsync({
        secretName,
        accessToken,
      });
      setIsLoading(false);

      if (amplitudeIsInit) {
        sendAmplitudeData("delete_secret");
      }

      setOpen(false);

      toast({
        variant: "alert-success",
        title: "Secret deleted successfully",
        size: "small",
      });
    } catch (error) {
      toast({
        title: "Something went wrong when deleting the secret",
        variant: "alert-error",
        size: "large",
        description: isAxiosError(error)
          ? getInstillApiErrorMessage(error)
          : null,
      });
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(open) => setOpen(open)}>
      <Dialog.Trigger asChild>
        <div className="text-sm-semibold cursor-pointer truncate text-center text-semantic-error-default">
          Delete
        </div>
      </Dialog.Trigger>
      <Dialog.Content className="!w-[350px]">
        <div className="flex flex-col">
          <div className="mx-auto mb-6 flex h-12 w-12 rounded-full bg-[#F0F5FF]">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="m-auto"
            >
              <path
                d="M15 9H15.01M15 15C18.3137 15 21 12.3137 21 9C21 5.68629 18.3137 3 15 3C11.6863 3 9 5.68629 9 9C9 9.27368 9.01832 9.54308 9.05381 9.80704C9.11218 10.2412 9.14136 10.4583 9.12172 10.5956C9.10125 10.7387 9.0752 10.8157 9.00469 10.9419C8.937 11.063 8.81771 11.1823 8.57913 11.4209L3.46863 16.5314C3.29568 16.7043 3.2092 16.7908 3.14736 16.8917C3.09253 16.9812 3.05213 17.0787 3.02763 17.1808C3 17.2959 3 17.4182 3 17.6627V19.4C3 19.9601 3 20.2401 3.10899 20.454C3.20487 20.6422 3.35785 20.7951 3.54601 20.891C3.75992 21 4.03995 21 4.6 21H6.33726C6.58185 21 6.70414 21 6.81923 20.9724C6.92127 20.9479 7.01881 20.9075 7.10828 20.8526C7.2092 20.7908 7.29568 20.7043 7.46863 20.5314L12.5791 15.4209C12.8177 15.1823 12.937 15.063 13.0581 14.9953C13.1843 14.9248 13.2613 14.8987 13.4044 14.8783C13.5417 14.8586 13.7588 14.8878 14.193 14.9462C14.4569 14.9817 14.7263 15 15 15Z"
                stroke="#316FED"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <h2 className="mb-1 text-center font-sans text-2xl font-bold leading-9 -tracking-[1%] text-[#1D2433]">
              Delete Secret
            </h2>
            <p className="mb-6 text-center font-sans text-base font-normal leading-6 text-[#1D2433] text-opacity-80">
              Are you sure you want to delete this secret?
            </p>
            <Form.Root {...form}>
              <form
                className="w-full"
                onSubmit={form.handleSubmit(handleDeleteApiToken)}
              >
                <div className="mb-6 flex flex-col">
                  <Form.Field
                    control={form.control}
                    name="code"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label className="!block" htmlFor={field.name}>
                            Please type
                            <span className="mx-1 select-all font-bold">
                              {displaySecretName}
                            </span>
                            to confirm.
                          </Form.Label>
                          <Form.Control>
                            <Input.Root>
                              <Input.Core
                                id={field.name}
                                type="text"
                                placeholder="Hello world"
                                {...field}
                              />
                            </Input.Root>
                          </Form.Control>
                          <Form.Message />
                        </Form.Item>
                      );
                    }}
                  />
                </div>
                <div className="flex w-full flex-row gap-x-2">
                  <Button
                    type="button"
                    className="w-full flex-1"
                    variant="secondaryGrey"
                    size="lg"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="w-full flex-1"
                    variant="primary"
                    size="lg"
                    disabled={
                      form.watch("code") === displaySecretName ? false : true
                    }
                  >
                    {isLoading ? <LoadingSpin /> : "Delete Secret"}
                  </Button>
                </div>
              </form>
            </Form.Root>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};
