import { FC } from "react";
import { Formik } from "formik";
import { useRouter } from "next/router";
import axios from "axios";

import { PrimaryButton } from "@/components/ui/Buttons";
import { useUpdateUser } from "@/services/mgmt";
import { FormBase, SingleSelect, TextField, ToggleField } from "../../formik";
import { User , mockMgmtRoles } from "@/lib/instill/mgmt";
import { SingleSelectOption } from "@instill-ai/design-system";

export type OnBoardingFormProps = {
  user?: Partial<User> | null;
};

const OnboardingForm: FC<OnBoardingFormProps> = ({ user }) => {
  const router = useRouter();
  const updateUser = useUpdateUser();
  return (
    <Formik
      initialValues={{
        email: user?.email || "",
        company_name: user?.company_name || "",
        role: user?.role
          ? mockMgmtRoles.find((e) => e.value === user.role)?.value
          : null,
        usage_data_collection: user?.usage_data_collection || false,
        newsletter_subscription: user?.newsletter_subscription || false,
      }}
      enableReinitialize={true}
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
          <FormBase marginBottom={null} gapY="gap-y-5" padding={null}>
            <TextField
              name="email"
              label="Your email"
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
              name="company_name"
              label="Your company"
              value={
                formik.values.company_name ? formik.values.company_name : ""
              }
              additionalOnChangeCb={null}
              description="Fill your company name"
              disabled={false}
              readOnly={false}
              required={true}
              placeholder=""
              type="text"
              autoComplete="off"
              error={formik.errors.company_name || null}
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
              value={
                user?.role
                  ? mockMgmtRoles.find((e) => e.value === user.role)
                    ? (mockMgmtRoles.find(
                        (e) => e.value === user.role
                      ) as SingleSelectOption)
                    : null
                  : null
              }
              error={formik.errors.role || null}
              additionalOnChangeCb={null}
            />
            <ToggleField
              name="usage_data_collection"
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
              error={formik.errors.usage_data_collection || null}
              additionalOnChangeCb={null}
            />
            <ToggleField
              name="newsletter_subscription"
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
              error={formik.errors.newsletter_subscription || null}
              additionalOnChangeCb={null}
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
