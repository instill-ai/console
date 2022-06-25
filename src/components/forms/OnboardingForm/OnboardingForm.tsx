import { FC, useCallback, useState } from "react";
import { Formik } from "formik";
import { useRouter } from "next/router";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { SingleSelectOption } from "@instill-ai/design-system";

import { PrimaryButton } from "@/components/ui";
import { useUpdateUser } from "@/services/mgmt";
import { FormBase, SingleSelect, TextField, ToggleField } from "../../formik";
import { User, mockMgmtRoles } from "@/lib/instill/mgmt";
import { useAmplitudeCtx } from "context/AmplitudeContext";
import { sendAmplitudeData } from "@/lib/amplitude";
import { Nullable } from "@/types/general";

export type OnBoardingFormProps = {
  user?: Partial<User> | null;
};

type OnboardingFormValue = {
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

  const roleOnChangeCb = useCallback((option: SingleSelectOption) => {
    setSelectedRoleOption(option);
  }, []);

  const validateForm = useCallback((values: OnboardingFormValue) => {
    const errors: OnboardingFormError = {};

    if (!values.email) {
      errors.email = "Required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = "Invalid email address";
    }

    if (!values.companyName) {
      errors.companyName = "Required";
    }

    if (!values.role) {
      errors.role = "Required";
    }

    return errors;
  }, []);

  const handleSubmit = useCallback(
    (values) => {
      if (!values.companyName || !values.email || !values.role) {
        return;
      }

      const token = uuidv4();

      const payload: Partial<User> = {
        id: "local-user",
        email: values.email,
        company_name: values.companyName,
        role: values.role as string,
        newsletter_subscription: values.newsletterSubscription
          ? values.newsletterSubscription
          : false,
        cookie_token: token,
      };

      updateUser.mutate(payload, {
        onSuccess: async () => {
          if (amplitudeIsInit) {
            sendAmplitudeData("fill_onboarding_form", {
              type: "critical_action",
            });
          }
          await axios.post("/api/set-user-cookie", { token });
          router.push("/pipelines");
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
          <FormBase marginBottom={null} gapY="gap-y-5" padding={null}>
            <TextField
              id="email"
              name="email"
              label="Your email"
              additionalMessageOnLabel={null}
              value={formik.values.email || ""}
              additionalOnChangeCb={null}
              description="Fill your email address"
              disabled={false}
              readOnly={false}
              required={true}
              placeholder=""
              type="email"
              autoComplete="on"
              error={formik.errors.email || null}
            />
            <TextField
              id="companyName"
              name="companyName"
              label="Your company"
              additionalMessageOnLabel={null}
              value={formik.values.companyName ? formik.values.companyName : ""}
              additionalOnChangeCb={null}
              description="Fill your company name"
              disabled={false}
              readOnly={false}
              required={true}
              placeholder=""
              type="text"
              autoComplete="off"
              error={formik.errors.companyName || null}
            />
            <SingleSelect
              id="role"
              name="role"
              label="Your role"
              additionalMessageOnLabel={null}
              options={mockMgmtRoles}
              value={selectedRoleOption}
              error={formik.errors.role || null}
              additionalOnChangeCb={roleOnChangeCb}
              disabled={false}
              readOnly={false}
              required={true}
              description={"Setup Guide"}
              menuPlacement="auto"
            />
            <ToggleField
              id="newsletterSubscription"
              name="newsletterSubscription"
              label="Newsletter subscription"
              disabled={false}
              readOnly={false}
              required={true}
              defaultChecked={
                user?.newsletter_subscription
                  ? user?.newsletter_subscription
                  : false
              }
              description="Receive the latest news from Instill AI: open source updates, community highlights, blog posts, useful tutorials and more! You can unsubscribe any time."
              error={formik.errors.newsletterSubscription || null}
              additionalOnChangeCb={null}
            />
            <PrimaryButton
              disabled={formik.isValid ? false : true}
              type="submit"
              position="ml-auto"
              onClickHandler={null}
            >
              Start
            </PrimaryButton>
          </FormBase>
        );
      }}
    </Formik>
  );
};

export default OnboardingForm;
