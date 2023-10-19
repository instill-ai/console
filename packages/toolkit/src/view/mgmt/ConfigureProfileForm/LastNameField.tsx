import * as React from "react";
import { BasicTextField } from "@instill-ai/design-system";
import { shallow } from "zustand/shallow";
import {
  useConfigureProfileFormStore,
  type Nullable,
  type User,
  type ConfigureProfileFormStore,
} from "../../../lib";

const selector = (state: ConfigureProfileFormStore) => ({
  lastName: state.fields.lastName,
  setFieldValue: state.setFieldValue,
  lastNameError: state.errors.lastName,
});

export type LastNameFieldProps = {
  user: Nullable<User>;
};

export const LastNameField = (props: LastNameFieldProps) => {
  const { user } = props;
  const { lastName, setFieldValue, lastNameError } =
    useConfigureProfileFormStore(selector, shallow);

  React.useEffect(() => {
    setFieldValue("lastName", user?.last_name || null);
  }, [user?.last_name, setFieldValue]);

  return (
    <div className="w-[287px]">
      <BasicTextField
        id="profile-lastname"
        label="Last name"
        key="lastName"
        additionalMessageOnLabel="(optional)"
        required={false}
        value={lastName}
        error={lastNameError}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setFieldValue("lastName", event.target.value)
        }
      />
    </div>
  );
};
