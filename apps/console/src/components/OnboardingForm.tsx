"use client";

import { ChangeEvent, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import type { AuthenticatedUser, Nullable } from "@instill-ai/toolkit";
import {
  BasicProgressMessageBox,
  BasicSingleSelect,
  BasicTextField,
  BasicToggleField,
  FormRoot,
  ProgressMessageBoxState,
  SelectOption,
  SolidButton,
} from "@instill-ai/design-system";
import {
  instillUserRoles,
  sendAmplitudeData,
  useAmplitudeCtx,
  useInstillStore,
  useUpdateAuthenticatedUser,
} from "@instill-ai/toolkit";

export type OnboardingFormValues = {
  email: Nullable<string>;
  companyName: Nullable<string>;
  role: Nullable<string>;
  newsletterSubscription: Nullable<boolean>;
};

type OnboardingFormErrors = {
  email: Nullable<string>;
  companyName: Nullable<string>;
  role: Nullable<string>;
};

export const OnboardingForm = () => {
  const router = useRouter();
  const updateUser = useUpdateAuthenticatedUser();
  const { amplitudeIsInit } = useAmplitudeCtx();

  const accessToken = useInstillStore((store) => store.accessToken);

  const [fieldValues, setFieldValues] = useState<OnboardingFormValues>({
    email: null,
    companyName: null,
    role: null,
    newsletterSubscription: true,
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
        key === "newsletterSubscription"
          ? event.target.checked
          : event.target.value;

      if (key === "email") {
        let error: Nullable<string> = null;

        if (!value) {
          error = "Email is required";
        } else {
          if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
              event.target.value,
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

      if (key === "companyName") {
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
          key === "newsletterSubscription"
            ? event.target.checked
            : event.target.value,
      }));
    },
    [],
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
    companyName: null,
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

    if (!fieldValues.companyName) {
      errors["companyName"] = "Company name is required";
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
        companyName: fieldValues.companyName as string,
      },
      role: fieldValues.role as string,
      newsletterSubscription: fieldValues.newsletterSubscription
        ? fieldValues.newsletterSubscription
        : false,
      cookieToken: token,
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
          cookieToken: token,
        }),
      });
      router.push(`/${user.id}/pipelines`);
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
          value={fieldValues.companyName}
          onChange={(event) => handleFieldChange("companyName", event)}
          error={fieldErrors.companyName}
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
          value={fieldValues.newsletterSubscription || false}
          required={true}
          description="Receive the latest news from Instill AI for product updates, community highlights, blog posts, useful tutorials and more! You can unsubscribe any time."
          onChange={(event) =>
            handleFieldChange("newsletterSubscription", event)
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
