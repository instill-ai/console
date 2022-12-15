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
} from "@instill-ai/design-system";

import { useUpdateUser } from "@/services/mgmt";
import { User, mockMgmtRoles } from "@/lib/instill/mgmt";
import { useAmplitudeCtx } from "@/contexts/AmplitudeContext";
import { sendAmplitudeData } from "@/lib/amplitude";
import { Nullable } from "@/types/general";
import { FormBase } from "@/components/ui";

export type OnboardingFormProps = {
  user: Nullable<Partial<User>>;
};

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

const OnboardingForm = ({ user }: OnboardingFormProps) => {
  const router = useRouter();
  const updateUser = useUpdateUser();
  const { amplitudeIsInit } = useAmplitudeCtx();

  const [fieldValues, setFieldValues] = useState<OnboardingFormValues>({
    email: null,
    companyName: null,
    role: null,
    newsletterSubscription: true,
  });

  const [selectedRoleOption, setSelectedRoleOption] =
    useState<Nullable<SingleSelectOption>>(null);

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
    companyName: null,
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

    if (!fieldValues.companyName) {
      errors["companyName"] = "Company name is required";
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
    if (!fieldValues.email || !fieldValues.companyName || !fieldValues.role)
      return;

    let token: string | undefined = undefined;

    if (user && user.cookie_token && user.cookie_token !== "") {
      token = user.cookie_token;
    } else {
      token = uuidv4();
    }

    const payload: Partial<User> = {
      id: "local-user",
      email: fieldValues.email,
      company_name: fieldValues.companyName ?? undefined,
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

    updateUser.mutate(payload, {
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

        if (!user) {
          await axios.post("/api/set-user-cookie", { token });
        }

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
    });
  }, [user, fieldValues, amplitudeIsInit, router, updateUser]);

  return (
    <FormBase
      noValidate={true}
      flex1={false}
      marginBottom={null}
      padding={null}
    >
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
          id="companyName"
          label="Your company"
          required={true}
          description="Fill your company name"
          value={fieldValues.companyName}
          onChange={(event) => handleFieldChange("companyName", event)}
          error={fieldErrors.companyName}
        />
        <BasicSingleSelect
          id="role"
          instanceId="role"
          label="Your role"
          required={true}
          options={mockMgmtRoles}
          value={selectedRoleOption}
          description="Pick a role closest to your job in your company"
          onChange={handleRoleChange}
          error={fieldErrors.role}
        />
        <BasicToggleField
          id="newsletterSubscription"
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
          setState={setMessageBoxState}
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
    </FormBase>
  );
};

export default OnboardingForm;
