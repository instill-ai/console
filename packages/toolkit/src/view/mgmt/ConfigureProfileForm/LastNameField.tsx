import * as React from "react";
import { BasicTextField, Label, Input } from "@instill-ai/design-system";
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
      <div className="mb-2 flex flex-row gap-x-2">
        <Label>Last Name</Label>
        <p className="my-auto font-sans text-xs font-normal text-instillGrey70">
          (optional)
        </p>
      </div>
      <Input.Root>
        <Input.Core
          disabled={false}
          id="profile-lastName"
          type="text"
          placeholder=""
          required={false}
          value={lastName || ""}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setFieldValue("lastName", event.target.value)
          }
        />
      </Input.Root>
      {lastNameError && (
        <p className="my-2 font-sans text-xs font-normal text-instillRed">
          {lastNameError}
        </p>
      )}
    </div>
  );
};
