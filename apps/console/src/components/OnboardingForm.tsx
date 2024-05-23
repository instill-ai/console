"use client";

import { ChangeEvent, useCallback, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import {
  BasicProgressMessageBox,
  BasicTextField,
  ProgressMessageBoxState,
  BasicSingleSelect,
  BasicToggleField,
  SolidButton,
  FormRoot,
  SelectOption,
} from "@instill-ai/design-system";

import {
  type AuthenticatedUser,
  type Nullable,
  useAmplitudeCtx,
  sendAmplitudeData,
  instillUserRoles,
  useUpdateAuthenticatedUser,
  useInstillStore,
} from "@instill-ai/toolkit";
import { useRouter } from "next/navigation";

export type OnboardingFormValues = {
  email: Nullable<string>;
  company_name: Nullable<string>;
  role: Nullable<string>;
  newsletter_subscription: Nullable<boolean>;
};

type OnboardingFormErrors = {
  email: Nullable<string>;
  company_name: Nullable<string>;
  role: Nullable<string>;
};

export const OnboardingForm = () => {
  const router = useRouter();
  const updateUser = useUpdateAuthenticatedUser();
  const { amplitudeIsInit } = useAmplitudeCtx();

  const accessToken = useInstillStore((store) => store.accessToken);

  const [fieldValues, setFieldValues] = useState<OnboardingFormValues>({
    email: null,
    company_name: null,
    role: null,
    newsletter_subscription: true,
  });

  const [selectedRoleOption, setSelectedRoleOption] = useState<
    Nullable<SelectOption>
  >(instillUserRoles.find((e) => e.value === fieldValues.role) || null);

  const [messageBoxState, setMessageBoxState] =
    useState<ProgressMessageBoxState>({
      activate: false,
      message: null,
      description: null,
      status: null,
    });

  // Handle fields change and per-field validation here

  const handleFieldChange = useCallback(
    (key: keyof OnboardingFormValues, event: ChangeEvent<HTMLInputElement>) => {
      const value =
        key === "newsletter_subscription"
          ? event.target.checked
          : event.target.value;

      if (key === "email") {
        let error: Nullable<string> = null;

        if (!value) {
          error = "Email is required";
        } else {
          if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
              event.target.value
            )
          ) {
            error = "Invalid email address";
          }
        }
        setFieldErrors((prev) => ({
          ...prev,
          email: error,
        }));
      }

      if (key === "company_name") {
        let error: Nullable<string> = null;
        if (!value) {
          error = "Company name is required";
        }
        setFieldErrors((prev) => ({
          ...prev,
          orgName: error,
        }));
      }

      setFieldValues((prev) => ({
        ...prev,
        [key]:
          key === "newsletter_subscription"
            ? event.target.checked
            : event.target.value,
      }));
    },
    []
  );

  const handleRoleChange = useCallback((option: Nullable<SelectOption>) => {
    if (!option) return;
    setSelectedRoleOption(option);

    let error: Nullable<string> = null;

    if (!option.value) {
      error = "Role is required";
    }

    setFieldErrors((prev) => ({
      ...prev,
      role: error,
    }));

    setFieldValues((prev) => ({
      ...prev,
      role: option.value as string,
    }));
  }, []);

  // Validate form and deal with error handling

  const [fieldErrors, setFieldErrors] = useState<OnboardingFormErrors>({
    email: null,
    company_name: null,
    role: null,
  });

  const handleSubmit = useCallback(async () => {
    if (!accessToken) {
      return;
    }

    const errors = {} as OnboardingFormErrors;

    if (!fieldValues.email) {
      errors["email"] = "Email is required";
    } else {
      if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(fieldValues.email)
      ) {
        errors["email"] = "Invalid email address";
      }
    }

    if (!fieldValues.company_name) {
      errors["company_name"] = "Company name is required";
    }

    if (!fieldValues.role) {
      errors["role"] = "Role is required";
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length !== 0) {
      return;
    }

    let token: string | undefined = undefined;

    token = uuidv4();

    const payload: Partial<AuthenticatedUser> = {
      email: fieldValues.email as string,
      profile: {
        company_name: fieldValues.company_name as string,
      },
      role: fieldValues.role as string,
      newsletter_subscription: fieldValues.newsletter_subscription
        ? fieldValues.newsletter_subscription
        : false,
      cookie_token: token,
    };

    setMessageBoxState(() => ({
      activate: true,
      status: "progressing",
      description: null,
      message: "Uploading...",
    }));

    try {
      const user = await updateUser.mutateAsync({
        payload,
        accessToken,
      });

      if (amplitudeIsInit) {
        sendAmplitudeData("submit_onboarding_form");
      }

      setMessageBoxState(() => ({
        activate: true,
        status: "success",
        description: null,
        message: "Succeed.",
      }));

      await axios.post("/api/set-user-cookie", {
        key: "instill-ai-user",
        value: JSON.stringify({
          cookie_token: token,
        }),
      });
      await router.push(`/${user.id}/pipelines`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong when uploading the form";
      setMessageBoxState(() => ({
        activate: true,
        status: "error",
        description: null,
        message,
      }));
    }
  }, [fieldValues, amplitudeIsInit, router, updateUser, accessToken]);

  return (
    <FormRoot formLess={false}>
      <div className="mb-10 flex flex-col gap-y-5">
        <BasicTextField
          id="email"
          label="Your email"
          description="Fill your email address"
          required={true}
          value={fieldValues.email}
          onChange={(event) => handleFieldChange("email", event)}
          error={fieldErrors.email}
        />
        <BasicTextField
          id="org-name"
          label="Your company"
          required={true}
          description="Fill your company name"
          value={fieldValues.company_name}
          onChange={(event) => handleFieldChange("company_name", event)}
          error={fieldErrors.company_name}
        />
        <BasicSingleSelect
          id="role"
          label="Your role"
          required={true}
          options={instillUserRoles}
          value={selectedRoleOption}
          description="Pick a role closest to your job in your company"
          onChange={handleRoleChange}
          error={fieldErrors.role}
        />
        <BasicToggleField
          id="newsletter-subscription"
          label="Newsletter subscription"
          value={fieldValues.newsletter_subscription || false}
          required={true}
          description="Receive the latest news from Instill AI for product updates, community highlights, blog posts, useful tutorials and more! You can unsubscribe any time."
          onChange={(event) =>
            handleFieldChange("newsletter_subscription", event)
          }
        />
      </div>
      <div className="flex flex-row">
        <BasicProgressMessageBox
          state={messageBoxState}
          setActivate={(activate) =>
            setMessageBoxState((prev) => ({
              ...prev,
              activate,
            }))
          }
          width="w-[25vw]"
          closable={true}
        />
        <SolidButton
          disabled={false}
          type="button"
          position="ml-auto my-auto"
          color="primary"
          onClickHandler={handleSubmit}
        >
          Start
        </SolidButton>
      </div>
    </FormRoot>
  );
};
