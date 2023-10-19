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
      <BasicTextField
        id="profile-firstname"
        label="First Name"
        additionalMessageOnLabel="(optional)"
        key="firstName"
        required={false}
        value={firstName}
        error={firstNameError}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setFieldValue("firstName", event.target.value)
        }
      />
    </div>
  );
};
