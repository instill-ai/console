import * as React from "react";
import { shallow } from "zustand/shallow";
import { BasicToggleField } from "@instill-ai/design-system";
import {
  useConfigureProfileFormStore,
  type Nullable,
  type User,
  type ConfigureProfileFormStore,
} from "../../../lib";

const selector = (state: ConfigureProfileFormStore) => ({
  newsletterSubscription: state.fields.newsletterSubscription,
  setFieldValue: state.setFieldValue,
});

export type NewsletterSubscriptionFieldProps = {
  user: Nullable<User>;
};

export const NewsletterSubscriptionField = (
  props: NewsletterSubscriptionFieldProps
) => {
  const { user } = props;
  const { newsletterSubscription, setFieldValue } =
    useConfigureProfileFormStore(selector, shallow);

  React.useEffect(() => {
    setFieldValue(
      "newsletterSubscription",
      user?.newsletter_subscription || null
    );
  }, [user?.newsletter_subscription, setFieldValue]);

  return (
    <div className="w-full">
      <BasicToggleField
        id="profile-newsletter-subscription"
        label="Newsletter subscription"
        value={newsletterSubscription || false}
        required={true}
        description="Receive the latest news from Instill AI for open source updates, community highlights, blog posts, useful tutorials and more! You can unsubscribe any time."
        onChange={(event) =>
          setFieldValue("newsletterSubscription", event.target.checked)
        }
      />
    </div>
  );
};
