import { SingleSelectOption } from "@instill-ai/design-system";
import { Nullable, useUser } from "../../lib";
import { ConfigureProfileForm } from "../mgmt";
import { TabBase } from "./TabBase";

export type ProfileTabProps = {
  accessToken: Nullable<string>;
  enableQuery: boolean;
};

export const mgmtRoleOptions: SingleSelectOption[] = [
  {
    label: "Manager",
    value: "manager",
  },
  {
    label: "AI Researcher",
    value: "ai-researcher",
  },
  {
    label: "AI Engineer",
    value: "ai-engineer",
  },
  {
    label: "Data Engineer",
    value: "data-engineer",
  },
  {
    label: "Data Scientist",
    value: "data-scientist",
  },
  {
    label: "Analytics Engineer",
    value: "analytics-engineer",
  },
  {
    label: "Hobbyist",
    value: "hobbyist",
  },
];

export const ProfileTab = (props: ProfileTabProps) => {
  const { accessToken, enableQuery } = props;

  const user = useUser({
    enabled: enableQuery,
    accessToken,
  });

  return (
    <TabBase title="Profile" description="Update your details here.">
      <div className="w-full min-w-[720px] rounded-sm border border-[#E4E4E4] bg-white p-10">
        <ConfigureProfileForm
          user={user.isSuccess ? user.data : null}
          roles={mgmtRoleOptions}
          width="lg:w-[680px] w-full"
          onConfigure={null}
          accessToken={accessToken}
        />
      </div>
    </TabBase>
  );
};
