import * as React from "react";
import { Label, Input } from "@instill-ai/design-system";
import { shallow } from "zustand/shallow";
import {
  useConfigureProfileFormStore,
  type Nullable,
  type User,
  type ConfigureProfileFormStore,
} from "../../../lib";

const selector = (state: ConfigureProfileFormStore) => ({
  firstName: state.fields.firstName,
  setFieldValue: state.setFieldValue,
  firstNameError: state.errors.firstName,
});

export type FirstNameFieldProps = {
  user: Nullable<User>;
};

export const FirstNameField = (props: FirstNameFieldProps) => {
  const { user } = props;
  const { firstName, setFieldValue, firstNameError } =
    useConfigureProfileFormStore(selector, shallow);

  React.useEffect(() => {
    setFieldValue("firstName", user?.first_name || null);
  }, [user?.first_name, setFieldValue]);

  return (
    <div className="w-[287px]">
      <div className="mb-2 flex flex-row gap-x-2">
        <Label>First Name</Label>
        <p className="my-auto font-sans text-xs font-normal text-instillGrey70">
          (optional)
        </p>
      </div>
      <Input.Root>
        <Input.Core
          disabled={false}
          id="profile-firstname"
          type="text"
          placeholder=""
          required={false}
          value={firstName || ""}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setFieldValue("firstName", event.target.value)
          }
        />
      </Input.Root>
      {firstNameError && (
        <p className="my-2 font-sans text-xs font-normal text-instillRed">
          {firstNameError}
        </p>
      )}
    </div>
  );
};
