import { FC, useCallback, useState } from "react";
import { Formik } from "formik";
import { useRouter } from "next/router";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import {
  BasicProgressMessageBox,
  ProgressMessageBoxState,
  SingleSelectOption,
} from "@instill-ai/design-system";

import { PrimaryButton } from "@/components/ui";
import { useUpdateUser } from "@/services/mgmt";
import {
  FormikFormBase,
  SingleSelect,
  TextField,
  ToggleField,
} from "@/components/formik";
import { User, mockMgmtRoles } from "@/lib/instill/mgmt";
import { useAmplitudeCtx } from "context/AmplitudeContext";
import { sendAmplitudeData } from "@/lib/amplitude";
import { Nullable } from "@/types/general";

export type OnBoardingFormProps = {
  user?: Partial<User> | null;
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

const OnboardingForm: FC<OnBoardingFormProps> = ({ user }) => {
  const router = useRouter();
  const updateUser = useUpdateUser();
  const { amplitudeIsInit } = useAmplitudeCtx();

  const [selectedRoleOption, setSelectedRoleOption] =
    useState<Nullable<SingleSelectOption>>(null);

  const [messageBoxState, setMessageBoxState] =
    useState<ProgressMessageBoxState>({
      activate: false,
      message: null,
      description: null,
      status: null,
    });

  const roleOnChangeCb = useCallback((option: SingleSelectOption) => {
    setSelectedRoleOption(option);
  }, []);

  const validateForm = useCallback((values: OnboardingFormValue) => {
    const errors: OnboardingFormError = {};

    if (!values.email) {
      errors.email = "Email is required";
    } else {
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = "Invalid email address";
      }
    }

    return errors;
  }, []);

  const handleSubmit = useCallback(
    (values: OnboardingFormValue) => {
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
      });
    },
    [amplitudeIsInit, router, updateUser]
  );

  return (
    <Formik
      initialValues={
        {
          email: null,
          companyName: null,
          role: null,
          newsletterSubscription: false,
        } as OnboardingFormValue
      }
      enableReinitialize={true}
      validate={validateForm}
      onSubmit={handleSubmit}
    >
      {(formik) => {
        return (
          <FormikFormBase marginBottom={null} gapY={null} padding={null}>
            <div className="mb-10 flex flex-col gap-y-5">
              <TextField
                id="email"
                name="email"
                label="Your email"
                description="Fill your email address"
                value={formik.values.email || ""}
                error={formik.errors.email || null}
                required={true}
              />
              <TextField
                id="companyName"
                name="companyName"
                label="Your company"
                description="Fill your company name"
                value={
                  formik.values.companyName ? formik.values.companyName : ""
                }
                error={formik.errors.companyName || null}
              />
              <SingleSelect
                id="role"
                name="role"
                label="Your role"
                options={mockMgmtRoles}
                value={selectedRoleOption}
                error={formik.errors.role || null}
                additionalOnChangeCb={roleOnChangeCb}
                description="Pick a role closest to your job in your company"
              />
              <ToggleField
                id="newsletterSubscription"
                name="newsletterSubscription"
                label="Newsletter subscription"
                value={formik.values.newsletterSubscription ?? false}
                additionalMessageOnLabel={null}
                disabled={false}
                readOnly={false}
                required={true}
                description="Receive the latest news from Instill AI for open source updates, community highlights, blog posts, useful tutorials and more! You can unsubscribe any time."
                error={formik.errors.newsletterSubscription || null}
                additionalOnChangeCb={null}
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
                disabled={formik.isValid ? false : true}
                type="submit"
                position="ml-auto my-auto"
                onClickHandler={null}
              >
                Start
              </PrimaryButton>
            </div>
          </FormikFormBase>
        );
      }}
    </Formik>
  );
};

export default OnboardingForm;
