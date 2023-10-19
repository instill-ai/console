import * as React from "react";
import {
  useConfigureProfileFormStore,
  type Nullable,
  type User,
  type ConfigureProfileFormStore,
} from "../../../lib";
import { BasicTextField } from "@instill-ai/design-system";
import { shallow } from "zustand/shallow";

const selector = (state: ConfigureProfileFormStore) => ({
  orgName: state.fields.orgName,
  setFieldValue: state.setFieldValue,
  orgNameError: state.errors.orgName,
});

export type OrgNameFieldProps = {
  user: Nullable<User>;
};

export const OrgNameField = (props: OrgNameFieldProps) => {
  const { user } = props;
  const { orgName, setFieldValue, orgNameError } = useConfigureProfileFormStore(
    selector,
    shallow
  );

  React.useEffect(() => {
    setFieldValue("orgName", user?.org_name || null);
  }, [user?.org_name, setFieldValue]);

  return (
    <div className="w-[287px]">
      <BasicTextField
        id="profile-orgname"
        label="Organisation Name"
        additionalMessageOnLabel="Your company name"
        key="orgName"
        required={false}
        value={orgName}
        error={orgNameError}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setFieldValue("orgName", event.target.value)
        }
      />
    </div>
  );
};
