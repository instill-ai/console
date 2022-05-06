import { PrimaryButton } from "@/components/ui/Buttons";
import { mockMgmtRoles } from "@/services/mgmt/MgmtServices";
import { Formik } from "formik";
import { FC } from "react";
import { SingleSelect, TextField, ToggleField } from "../FormikField";

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
          <div className="flex flex-col gap-y-5">
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
              name="dataDestination.new.type"
              instanceId="new-data-destination-type"
              disabled={false}
              readOnly={false}
              options={mockMgmtRoles}
              required={true}
              description={"Setup Guide"}
              label="Source type"
            />
            <ToggleField
              name="usage_data_collection"
              label="Anonymised usage data collection "
              disabled={false}
              readOnly={false}
              required={true}
              defaultChecked={true}
              description="We collect data only for product improvements"
            />
            <ToggleField
              name="newsletter_subscription"
              label="Newsletter subscription"
              disabled={false}
              readOnly={false}
              required={true}
              defaultChecked={true}
              description="Receive the latest news from Instill AI: open source updates, community highlights, blog posts, useful tutorials and more! You can unsubscribe any time."
            />
            <PrimaryButton disabled={formik.isValid} type="submit">
              Start
            </PrimaryButton>
          </div>
        );
      }}
    </Formik>
  );
};

export default OnboardingForm;
