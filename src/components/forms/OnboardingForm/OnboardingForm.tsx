import { PrimaryButton } from "@/components/ui/Buttons";
import { mockMgmtRoles } from "@/services/mgmt/MgmtServices";
import { Form, Formik } from "formik";
import { FC } from "react";
import { SingleSelect, TextField, ToggleField } from "../../formik/FormikField";

const OnboardingForm: FC = () => {
  return (
    <Formik
      initialValues={{
        email: null,
        username: null,
        company_name: null,
        role: null,
        usage_data_collection: null,
        newsletter_subscription: null,
      }}
      onSubmit={(values) => console.log(values)}
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
              name="username"
              label="User name"
              description="Pick a username"
              disabled={false}
              readOnly={false}
              required={true}
              placeholder=""
              type="text"
              autoComplete="off"
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
