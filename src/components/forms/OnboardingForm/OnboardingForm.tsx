import { FC } from "react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import axios from "axios";

import { PrimaryButton } from "@/components/ui/Buttons";
import { mockMgmtRoles, useUpdateUser } from "@/services/mgmt/MgmtServices";
import { SingleSelect, TextField, ToggleField } from "../../formik";
import { User } from "@/lib/instill/mgmt";

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
        companyName: user?.companyName ? user.companyName : null,
        role: user?.role
          ? mockMgmtRoles.find((e) => e.value === user.role)?.value
          : null,
        usageDataCollection: user?.usageDataCollection
          ? user.usageDataCollection
          : null,
        newsletterSubscription: user?.newsletterSubscription
          ? user.newsletterSubscription
          : null,
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
          role: values.role as string,
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
              value={formik.values.companyName ? formik.values.companyName : ""}
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
              defaultValue={
                user?.role
                  ? mockMgmtRoles.find((e) => e.value === user.role)
                  : undefined
              }
            />
            <ToggleField
              name="usageDataCollection"
              label="Anonymised usage data collection "
              disabled={false}
              readOnly={false}
              required={true}
              defaultChecked={
                user?.usageDataCollection ? user?.usageDataCollection : false
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
                user?.newsletterSubscription
                  ? user?.newsletterSubscription
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
          </Form>
        );
      }}
    </Formik>
  );
};

export default OnboardingForm;
