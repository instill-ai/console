"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import {
  Button,
  Form,
  Input,
  Select,
  Switch,
  useToast,
} from "@instill-ai/design-system";
import {
  DataTestID,
  instillUserRoles,
  toastInstillError,
  useInstillStore,
  useUpdateAuthenticatedUser,
} from "@instill-ai/toolkit";

const OnboardingFormSchema = z.object({
  displayName: z.string().min(1, "Display name is required"),
  email: z.string().email(),
  role: z.string(),
  companyName: z.string().min(1, "Company name is required"),
  newsletterSubscription: z.boolean(),
});

export const OnboardingForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const accessToken = useInstillStore((store) => store.accessToken);
  const form = useForm<z.infer<typeof OnboardingFormSchema>>({
    resolver: zodResolver(OnboardingFormSchema),
    defaultValues: {
      displayName: "",
      email: "",
      role: "Creative Production",
      companyName: "",
      newsletterSubscription: false,
    },
  });

  const updateAuthenticatedUser = useUpdateAuthenticatedUser();
  async function onSubmit(data: z.infer<typeof OnboardingFormSchema>) {
    let token: string | undefined = undefined;

    token = uuidv4();

    setIsSubmitting(true);

    const payload = {
      email: data.email,
      profile: {
        companyName: data.companyName,
        displayName: data.displayName,
      },
      role: data.role,
      newsletterSubscription: data.newsletterSubscription
        ? data.newsletterSubscription
        : false,
      cookieToken: token,
    };

    try {
      const user = await updateAuthenticatedUser.mutateAsync({
        payload,
        accessToken,
      });

      await fetch("/api/set-user-cookie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: "instill-ai-user",
          value: JSON.stringify({
            cookieToken: token,
          }),
        }),
      });
      router.push(`/${user.id}/pipelines`);
    } catch (error) {
      toastInstillError({
        title: "Something went wrong when onboarding your account",
        toast,
        error,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form.Root {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-y-5"
      >
        <Form.Field
          control={form.control}
          name="email"
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label className="product-body-text-3-semibold">
                  Email
                </Form.Label>
                <Form.Control>
                  <Input.Root>
                    <Input.Core
                      {...field}
                      type="text"
                      className="!product-body-text-2-regular"
                      value={field.value ?? ""}
                      autoComplete="off"
                    />
                  </Input.Root>
                </Form.Control>
                <Form.Message />
                <Form.Description text="Fill your email address" />
              </Form.Item>
            );
          }}
        />
        <Form.Field
          control={form.control}
          name="displayName"
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label className="product-body-text-3-semibold">
                  Display Name
                </Form.Label>
                <Form.Control>
                  <Input.Root>
                    <Input.Core
                      {...field}
                      type="text"
                      className="!product-body-text-2-regular"
                      value={field.value ?? ""}
                      autoComplete="off"
                    />
                  </Input.Root>
                </Form.Control>
                <Form.Message />
                <Form.Description text="Fill your name" />
              </Form.Item>
            );
          }}
        />
        <Form.Field
          control={form.control}
          name="companyName"
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label className="product-body-text-3-semibold">
                  Your Company
                </Form.Label>
                <Form.Control>
                  <Input.Root>
                    <Input.Core
                      {...field}
                      type="text"
                      className="!product-body-text-2-regular"
                      value={field.value ?? ""}
                      autoComplete="off"
                    />
                  </Input.Root>
                </Form.Control>
                <Form.Message />
                <Form.Description text="Fill your company name" />
              </Form.Item>
            );
          }}
        />
        <Form.Field
          control={form.control}
          name="role"
          render={({ field }) => {
            return (
              <Form.Item className="flex flex-col gap-y-2.5 md:w-1/2">
                <Form.Label className="product-body-text-3-semibold">
                  Your role
                </Form.Label>
                <Form.Control>
                  <Select.Root
                    value={field?.value}
                    onValueChange={(value: string) => {
                      field.onChange(value);
                    }}
                  >
                    <Select.Trigger
                      data-testid={DataTestID.onboardingFormRoleField}
                      className="mt-auto w-full"
                    >
                      <Select.Value />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Group>
                        {instillUserRoles.map((role) => (
                          <Select.Item
                            key={role.value}
                            value={role.value}
                            label={role.label}
                          />
                        ))}
                      </Select.Group>
                    </Select.Content>
                  </Select.Root>
                </Form.Control>
                <Form.Message />
                <Form.Description text="Pick a role closest to your job in your company" />
              </Form.Item>
            );
          }}
        />
        <Form.Field
          control={form.control}
          name="newsletterSubscription"
          render={({ field }) => {
            return (
              <div className="flex-rol flex gap-x-3">
                <div className="pt-1">
                  <Form.Control>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                  </Form.Control>
                </div>
                <div className="flex flex-col">
                  <p className="text-semantic-fg-primary product-body-text-2-semibold">
                    Subscribe to our newsletter
                  </p>
                  <p className="text-semantic-fg-secondary product-body-text-2-regular">
                    For product updates, community highlights, blog posts,
                    useful tutorials and more!
                  </p>
                </div>
              </div>
            );
          }}
        />
        <div className="flex flex-row-reverse w-full">
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Start"}
          </Button>
        </div>
      </form>
    </Form.Root>
  );
};
