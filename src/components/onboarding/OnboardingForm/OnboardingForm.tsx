import { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
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
} from "@instill-ai/design-system";

import { PrimaryButton } from "@/components/ui";
import { useUpdateUser } from "@/services/mgmt";
import { User, mockMgmtRoles } from "@/lib/instill/mgmt";
import { useAmplitudeCtx } from "@/contexts/AmplitudeContext";
import { sendAmplitudeData } from "@/lib/amplitude";
import { Nullable } from "@/types/general";
import { FormBase } from "@/components/forms";

export type OnboardingFormProps = {
  user: Nullable<Partial<User>>;
};

export type OnboardingFormValue = {
  email: Nullable<string>;
  companyName: Nullable<string>;
  role: Nullable<string>;
  newsletterSubscription: Nullable<boolean>;
};

type OnboardingFormError = {
  email?: string;
  companyName?: string;
  role?: string;
  newsletterSubscription?: string;
};

const OnboardingForm: FC<OnboardingFormProps> = ({ user }) => {
  const router = useRouter();
  const updateUser = useUpdateUser();
  const { amplitudeIsInit } = useAmplitudeCtx();

  const [values, setValues] = useState<OnboardingFormValue>({
    email: null,
    companyName: null,
    role: null,
    newsletterSubscription: null,
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
    (key: keyof OnboardingFormValue, event: ChangeEvent<HTMLInputElement>) => {
      setFormIsDirty(true);
      setValues((prev) => ({
        ...prev,
        [key]: event.target.value,
      }));
    },
    []
  );

  const handleRoleChange = useCallback(
    (option: Nullable<SingleSelectOption>) => {
      if (!option) return;

      setSelectedRoleOption(option);
      setValues((prev) => ({
        ...prev,
        role: option.value as string,
      }));
    },
    []
  );

  // Validate form and deal with error handling

  const [errors, setErrors] = useState<OnboardingFormError>({});
  const [formIsValid, setFormIsValid] = useState(false);

  useEffect(() => {
    if (!values.email) {
      if (formIsDirty) {
        errors.email = "Email is required";
        setErrors({
          email: "Email is required",
        });
      }
    } else {
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        setErrors({
          email: "Invalid email address",
        });
        return;
      } else {
        setErrors({
          email: undefined,
        });
        setFormIsValid(true);
      }
    }
  }, [values]);

  // Handle form submission

  const handleSubmit = useCallback(() => {
    if (!values.email) return;

    const token = uuidv4();

    const payload: Partial<User> = {
      id: "local-user",
      email: values.email,
      company_name: values.companyName ?? undefined,
      role: values.role as string,
      newsletter_subscription: values.newsletterSubscription
        ? values.newsletterSubscription
        : false,
      cookie_token: user ? user.cookie_token : token,
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
  }, [user, values, amplitudeIsInit, router, updateUser]);

  return (
    <FormBase
      padding={null}
      noValidate={true}
      flex1={false}
      marginBottom={null}
    >
      <div className="mb-10 flex flex-col gap-y-5">
        <BasicTextField
          id="email"
          label="Your email"
          description="Fill your email address"
          required={true}
          value={values.email}
          onChange={(event) => handleFieldChange("email", event)}
          error={errors.email}
        />
        <BasicTextField
          id="companyName"
          label="Your company"
          description="Fill your company name"
          value={values.companyName}
          onChange={(event) => handleFieldChange("companyName", event)}
          error={errors.companyName}
        />
        <BasicSingleSelect
          id="role"
          instanceId="role"
          label="Your role"
          options={mockMgmtRoles}
          value={selectedRoleOption}
          description="Pick a role closest to your job in your company"
          onChange={handleRoleChange}
          error={errors.role}
        />
        <BasicToggleField
          id="newsletterSubscription"
          label="Newsletter subscription"
          value={values.newsletterSubscription || false}
          required={true}
          description="Receive the latest news from Instill AI for open source updates, community highlights, blog posts, useful tutorials and more! You can unsubscribe any time."
          onChange={(event) =>
            handleFieldChange("newsletterSubscription", event)
          }
          error={errors.newsletterSubscription}
        />
      </div>
      <div className="flex flex-row">
        <BasicProgressMessageBox
          state={messageBoxState}
          setState={setMessageBoxState}
          width="w-[25vw]"
          closable={true}
        />
        <PrimaryButton
          disabled={!formIsValid}
          type="button"
          position="ml-auto my-auto"
          onClickHandler={handleSubmit}
        >
          Start
        </PrimaryButton>
      </div>
    </FormBase>
  );
};

export default OnboardingForm;
