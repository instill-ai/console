import { useRouter } from "next/router";
import { Setting } from "..";

export const UserSidebar = () => {
  const router = useRouter();

  const { entity } = router.query;

  const profileTabLink = `/${entity}/settings/profile`;
  const accountTabLink = `/${entity}/settings/account`;
  const apiTokensTabLink = `/${entity}/settings/api-tokens`;

  return (
    <Setting.SidebarRoot>
      <Setting.SidebarItem
        href={profileTabLink}
        name="Profile"
        highlighted={router.pathname.split("/")[3] === "profile"}
      />
      <Setting.SidebarItem
        href={accountTabLink}
        name="Account"
        highlighted={router.pathname.split("/")[3] === "account"}
      />
      <Setting.SidebarItem
        href={apiTokensTabLink}
        name="API Tokens"
        highlighted={router.pathname.split("/")[3] === "api-tokens"}
      />
    </Setting.SidebarRoot>
  );
};
