import { FC } from "react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import axios from "axios";

import { PrimaryButton } from "@/components/ui/Buttons";
import { mockMgmtRoles, useUpdateUser } from "@/services/mgmt/MgmtServices";
import { SingleSelect, TextField, ToggleField } from "../../formik";
import { User } from "@/lib/instill/mgmt";

const OnboardingForm: FC = () => {
  const router = useRouter();
  const updateUser = useUpdateUser();
  return (
    <Formik
      initialValues={{
        email: null,
        companyName: null,
        role: null,
        usageDataCollection: null,
        newsletterSubscription: null,
      }}
      onSubmit={async (values) => {
        if (
          !values.companyName ||
          !values.email ||
          !values.newsletterSubscription ||
          !values.usageDataCollection ||
          !values.role
        ) {
          return;
        }

        const body: Partial<User> = {
          id: "local-user",
          email: values.email,
          companyName: values.companyName,
          role: values.role,
          newsletterSubscription: values.newsletterSubscription,
          usageDataCollection: values.usageDataCollection,
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
          <Form className="flex flex-col gap-y-5">
            <TextField
              name="email"
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
            />
            <ToggleField
              name="usageDataCollection"
              label="Anonymised usage data collection "
              disabled={false}
              readOnly={false}
              required={true}
              defaultChecked={false}
              description="We collect data only for product improvements"
            />
            <ToggleField
              name="newsletterSubscription"
              label="Newsletter subscription"
              disabled={false}
              readOnly={false}
              required={true}
              defaultChecked={false}
              description="Receive the latest news from Instill AI: open source updates, community highlights, blog posts, useful tutorials and more! You can unsubscribe any time."
            />
            <PrimaryButton
              disabled={formik.isValid ? false : true}
              type="submit"
              position="ml-auto"
            >
              Start
            </PrimaryButton>
          </Form>
        );
      }}
    </Formik>
  );
};

export default OnboardingForm;
