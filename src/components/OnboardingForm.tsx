import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import {
  BasicProgressMessageBox,
  BasicTextField,
  ProgressMessageBoxState,
  SingleSelectOption,
  BasicSingleSelect,
  BasicToggleField,
  SolidButton,
  FormRoot,
} from "@instill-ai/design-system";

import {
  useUpdateUser,
  useAmplitudeCtx,
  sendAmplitudeData,
  type User,
  type Nullable,
} from "@instill-ai/toolkit";
import { mgmtRoleOptions } from "@/lib";

export type OnboardingFormProps = {
  user: Nullable<Partial<User>>;
};

export type OnboardingFormValues = {
  email: Nullable<string>;
  orgName: Nullable<string>;
  role: Nullable<string>;
  newsletterSubscription: Nullable<boolean>;
};

type OnboardingFormErrors = {
  email: Nullable<string>;
  orgName: Nullable<string>;
  role: Nullable<string>;
};

export const OnboardingForm = ({ user }: OnboardingFormProps) => {
  const router = useRouter();
  const updateUser = useUpdateUser();
  const { amplitudeIsInit } = useAmplitudeCtx();

  const [fieldValues, setFieldValues] = useState<OnboardingFormValues>({
    email: user?.email || null,
    orgName: user?.org_name || null,
    role: user?.role || null,
    newsletterSubscription: user?.newsletter_subscription || false,
  });

  const [selectedRoleOption, setSelectedRoleOption] = useState<
    Nullable<SingleSelectOption>
  >(mgmtRoleOptions.find((e) => e.value === fieldValues.role) || null);

  const [messageBoxState, setMessageBoxState] =
    useState<ProgressMessageBoxState>({
      activate: false,
      message: null,
      description: null,
      status: null,
    });

  const [formIsDirty, setFormIsDirty] = useState(false);

  // Handle fields change

  const handleFieldChange = useCallback(
    (key: keyof OnboardingFormValues, event: ChangeEvent<HTMLInputElement>) => {
      setFormIsDirty(true);
      setFieldValues((prev) => ({
        ...prev,
        [key]:
          key === "newsletterSubscription"
            ? event.target.checked
            : event.target.value,
      }));
    },
    []
  );

  const handleRoleChange = useCallback(
    (option: Nullable<SingleSelectOption>) => {
      if (!option) return;
      setFormIsDirty(true);
      setSelectedRoleOption(option);
      setFieldValues((prev) => ({
        ...prev,
        role: option.value as string,
      }));
    },
    []
  );

  // Validate form and deal with error handling

  const [fieldErrors, setFieldErrors] = useState<OnboardingFormErrors>({
    email: null,
    orgName: null,
    role: null,
  });

  const [formIsValid, setFormIsValid] = useState(false);

  useEffect(() => {
    if (!formIsDirty) return;
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

    if (!fieldValues.orgName) {
      errors["orgName"] = "Company name is required";
    }

    if (!fieldValues.role) {
      errors["role"] = "Role is required";
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length === 0) {
      setFormIsValid(true);
    }
  }, [fieldValues, formIsDirty]);

  const handleSubmit = useCallback(() => {
    if (!fieldValues.email || !fieldValues.orgName || !fieldValues.role) return;

    let token: string | undefined = undefined;

    token = uuidv4();

    const payload: Partial<User> = {
      id: "local-user",
      name: "users/local-user",
      email: fieldValues.email,
      org_name: fieldValues.orgName ?? undefined,
      role: fieldValues.role as string,
      newsletter_subscription: fieldValues.newsletterSubscription
        ? fieldValues.newsletterSubscription
        : false,
      cookie_token: token,
    };

    setMessageBoxState(() => ({
      activate: true,
      status: "progressing",
      description: null,
      message: "Uploading...",
    }));

    updateUser.mutate(
      { payload, accessToken: null },
      {
        onSuccess: async () => {
          if (amplitudeIsInit) {
            sendAmplitudeData("fill_onboarding_form", {
              type: "critical_action",
            });
          }

          setMessageBoxState(() => ({
            activate: true,
            status: "success",
            description: null,
            message: "Succeed.",
          }));
          await axios.post("/api/set-user-cookie", { token });
          router.push("/pipelines");
        },
        onError: (error) => {
          if (error instanceof Error) {
            setMessageBoxState(() => ({
              activate: true,
              status: "error",
              description: null,
              message: error.message,
            }));
          } else {
            setMessageBoxState(() => ({
              activate: true,
              status: "error",
              description: null,
              message: "Something went wrong when upload the form",
            }));
          }
        },
      }
    );
  }, [fieldValues, amplitudeIsInit, router, updateUser]);

  return (
    <FormRoot marginBottom={null} formLess={false} width={null}>
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
          value={fieldValues.orgName}
          onChange={(event) => handleFieldChange("orgName", event)}
          error={fieldErrors.orgName}
        />
        <BasicSingleSelect
          id="role"
          label="Your role"
          required={true}
          options={mgmtRoleOptions}
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
          description="Receive the latest news from Instill AI for open source updates, community highlights, blog posts, useful tutorials and more! You can unsubscribe any time."
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
          disabled={!formIsValid}
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
