import type { Nullable, User } from "../../../lib";
import { FirstNameField } from "./FirstNameField";
import { LastNameField } from "./LastNameField";
import { OrgNameField } from "./OrgNameField";
import { RoleField } from "./RoleField";
import { UserNameField } from "./UserNameField";
import {
  SingleSelectOption,
  FormRoot,
  FormRootProps,
} from "@instill-ai/design-system";
import { NewsletterSubscriptionField } from "./NewsletterSubscriptionField";
import { ConfigureProfileControl } from "./ConfigureProfileControl";

export type ConfigureProfileFormProps = {
  user: Nullable<User>;
  roles: SingleSelectOption[];
  onConfigure: Nullable<() => void>;
  accessToken: Nullable<string>;
} & Pick<FormRootProps, "marginBottom" | "width">;

export const ConfigureProfileForm = (props: ConfigureProfileFormProps) => {
  const { user, marginBottom, roles, width, onConfigure, accessToken } = props;

  return (
    <FormRoot marginBottom={marginBottom} width={width}>
      <div className="mb-8 flex flex-col gap-y-6">
        <div className="flex flex-row gap-x-6">
          <FirstNameField user={user} />
          <LastNameField user={user} />
        </div>
        <UserNameField user={user} />
        <OrgNameField user={user} />
        <RoleField roles={roles} user={user} />
        <NewsletterSubscriptionField user={user} />
      </div>
      <ConfigureProfileControl
        onConfigure={onConfigure}
        accessToken={accessToken}
      />
    </FormRoot>
  );
};
