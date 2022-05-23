import { FC } from "react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import axios from "axios";

import { PrimaryButton } from "@/components/ui/Buttons";
import { mockMgmtRoles, useUpdateUser } from "@/services/mgmt/MgmtServices";
import { FormBase, SingleSelect, TextField, ToggleField } from "../../formik";
import { User } from "@/lib/instill/mgmt";
import { SingleSelectOption } from "@instill-ai/design-system";

export type OnBoardingFormProps = {
  user?: Partial<User> | null;
};

const OnboardingForm: FC<OnBoardingFormProps> = ({ user }) => {
  const router = useRouter();
  const updateUser = useUpdateUser();
  console.log(user?.role);
  return (
    <Formik
      initialValues={{
        email: user?.email ? user.email : null,
        company_name: user?.company_name ? user.company_name : null,
        role: user?.role
          ? mockMgmtRoles.find((e) => e.value === user.role)?.value
          : null,
        usage_data_collection: user?.usage_data_collection
          ? user.usage_data_collection
          : null,
        newsletter_subscription: user?.newsletter_subscription
          ? user.newsletter_subscription
          : null,
      }}
      onSubmit={async (values) => {
        if (
          !values.company_name ||
          !values.email ||
          !values.newsletter_subscription ||
          !values.usage_data_collection ||
          !values.role
        ) {
          return;
        }

        const body: Partial<User> = {
          id: "local-user",
          email: values.email,
          company_name: values.company_name,
          role: values.role as string,
          newsletter_subscription: values.newsletter_subscription,
          usage_data_collection: values.usage_data_collection,
        };

        updateUser.mutate(body, {
          onSuccess: async () => {
            await axios.post("/api/set-user-onboarded-cookie");
            router.push("/pipelines");
          },
        });
      }}
    >
      {(formik) => {
        return (
          <FormBase gapY="gap-y-5" padding={null}>
            <TextField
              name="email"
              value={formik.values.email ? formik.values.email : ""}
              onChangeCb={formik.handleChange}
              label="Your email"
              description="Fill your email address"
              disabled={false}
              readOnly={false}
              required={true}
              placeholder=""
              type="email"
              autoComplete="on"
            />
            <TextField
              name="companyName"
              label="Your company"
              value={
                formik.values.company_name ? formik.values.company_name : ""
              }
              onChangeCb={formik.handleChange}
              description="Fill your company name"
              disabled={false}
              readOnly={false}
              required={true}
              placeholder=""
              type="text"
              autoComplete="off"
            />
            <SingleSelect
              name="role"
              label="Your role"
              instanceId="new-data-destination-type"
              disabled={false}
              readOnly={false}
              options={mockMgmtRoles}
              required={true}
              description={"Setup Guide"}
              menuPlacement="auto"
              defaultValue={
                user?.role
                  ? mockMgmtRoles.find((e) => e.value === user.role)
                    ? (mockMgmtRoles.find(
                        (e) => e.value === user.role
                      ) as SingleSelectOption)
                    : null
                  : null
              }
            />
            <ToggleField
              name="usageDataCollection"
              label="Anonymised usage data collection "
              disabled={false}
              readOnly={false}
              required={true}
              defaultChecked={
                user?.usage_data_collection
                  ? user?.usage_data_collection
                  : false
              }
              description="We collect data only for product improvements"
            />
            <ToggleField
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
            />
            <PrimaryButton
              disabled={formik.isValid ? false : true}
              type="submit"
              position="ml-auto"
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
