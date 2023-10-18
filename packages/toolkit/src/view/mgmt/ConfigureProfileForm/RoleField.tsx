import * as React from "react";
import {
  BasicSingleSelect,
  SingleSelectOption,
} from "@instill-ai/design-system";
import { shallow } from "zustand/shallow";
import {
  useConfigureProfileFormStore,
  type Nullable,
  type User,
  type ConfigureProfileFormStore,
} from "../../../lib";

export type RoleFieldProps = {
  roles: SingleSelectOption[];
  user: Nullable<User>;
};

const selector = (state: ConfigureProfileFormStore) => ({
  role: state.fields.role,
  setFieldValue: state.setFieldValue,
  roleError: state.errors.role,
});

export const RoleField = (props: RoleFieldProps) => {
  const { roles, user } = props;
  const { setFieldValue, roleError } = useConfigureProfileFormStore(
    selector,
    shallow
  );

  const [selectedRoleOption, setSelectedRoleOption] =
    React.useState<Nullable<SingleSelectOption>>(null);

  React.useEffect(() => {
    if (!user) return;
    setFieldValue("role", user.role || null);
    setSelectedRoleOption(roles.find((e) => e.value === user.role) || null);
  }, [user, setFieldValue, roles]);

  return (
    <div className="w-[287px]">
      <BasicSingleSelect
        id="profile-role"
        label="Role"
        additionalMessageOnLabel="(optional)"
        key="role"
        required={false}
        options={roles}
        value={selectedRoleOption}
        error={roleError}
        onChange={(option) => {
          setFieldValue("role", option ? option.value.toString() : null);
          setSelectedRoleOption(
            roles.find((e) => e.value === option?.value.toString()) || null
          );
        }}
      />
    </div>
  );
};
