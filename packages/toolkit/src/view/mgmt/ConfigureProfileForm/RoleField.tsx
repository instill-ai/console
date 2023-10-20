import * as React from "react";
import {
  BasicSingleSelect,
  Label,
  Select,
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
      <div className="mb-2 flex flex-row gap-x-2">
        <Label>Role</Label>
        <p className="my-auto font-sans text-xs font-normal text-instillGrey70">
          (optional)
        </p>
      </div>

      <Select.Root
        value={selectedRoleOption?.value}
        onValueChange={(option) => {
          setFieldValue("role", option ? option.toString() : null);
          setSelectedRoleOption(
            roles.find((e) => e.value === option?.toString()) || null
          );
        }}
      >
        <Select.Trigger className="w-full pl-[14px]">
          <Select.Value placeholder="Select Role" />
        </Select.Trigger>
        <Select.Content>
          <Select.Group>
            {roles.map((role) => (
              <Select.Item value={role.value} key={role.value}>
                {role.label}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>

      {roleError && (
        <p className="my-2 font-sans text-xs font-normal text-instillRed">
          {roleError}
        </p>
      )}
    </div>
  );
};
