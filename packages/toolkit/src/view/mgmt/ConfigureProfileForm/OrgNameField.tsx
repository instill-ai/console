import * as React from "react";
import {
  useConfigureProfileFormStore,
  type Nullable,
  type User,
  type ConfigureProfileFormStore,
} from "../../../lib";
import { Label, Input } from "@instill-ai/design-system";
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
      <div className="mb-2 flex flex-row gap-x-2">
        <Label>Organisation Name</Label>
        <p className="my-auto font-sans text-xs font-normal text-instillGrey70">
          Your company name
        </p>
      </div>
      <Input.Root>
        <Input.Core
          disabled={false}
          id="profile-orgname"
          type="text"
          placeholder=""
          required={false}
          value={orgName || ""}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFieldValue("orgName", event.target.value);
          }}
        />
      </Input.Root>
      {orgNameError && (
        <p className="my-2 font-sans text-xs font-normal text-instillRed">
          {orgNameError}
        </p>
      )}
    </div>
  );
};
