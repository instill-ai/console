import * as React from "react";
import { shallow } from "zustand/shallow";
import { Switch, Field, Label } from "@instill-ai/design-system";
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
      <Field.Root className="!space-y-2">
        <Label htmlFor="profile-newsletter-subscription">
          Newsletter subscription *
        </Label>
        <Switch
          id="profile-newsletter-subscription"
          onCheckedChange={(checked) => {
            setFieldValue("newsletterSubscription", checked);
          }}
          checked={newsletterSubscription || false}
        />
        <Field.Description className="m-3">
          Receive the latest news from Instill AI for open source updates,
          community highlights, blog posts, useful tutorials and more! You can
          unsubscribe any time.
        </Field.Description>
      </Field.Root>
    </div>
  );
};
