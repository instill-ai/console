import { FC } from "react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";

import { PrimaryButton } from "@/components/ui/Buttons";
import { mockMgmtRoles } from "@/services/mgmt/MgmtServices";
import { SingleSelect, TextField, ToggleField } from "../../formik";
import axios from "axios";

const OnboardingForm: FC = () => {
  const router = useRouter();
  return (
    <Formik
      initialValues={{
        email: null,
        company_name: null,
        role: null,
        usage_data_collection: null,
        newsletter_subscription: null,
      }}
      onSubmit={async (values) => {
        try {
          const res = await axios.post("/api/submit-onboarded-form", {
            email: values.email,
            company_name: values.company_name,
            role: values.role,
            usage_data_collection: values.usage_data_collection,
            newsletter_subscription: values.newsletter_subscription,
          });

          if (res.status === 200) {
            await axios.post("/api/set-user-onboarded-cookie");
            router.push("/pipelines");
          }
        } catch (err) {
          console.error(
            "Something whet wrong when submit onboarding form",
            err
          );
        }
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
              name="company_name"
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
              name="usage_data_collection"
              label="Anonymised usage data collection "
              disabled={false}
              readOnly={false}
              required={true}
              defaultChecked={false}
              description="We collect data only for product improvements"
            />
            <ToggleField
              name="newsletter_subscription"
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
