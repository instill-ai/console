"use client";

import { usePathname, useRouter } from "next/navigation";
import { Setting } from "..";

export const UserSidebar = () => {
  const pathname = usePathname();

  return (
    <Setting.SidebarRoot>
      <Setting.SidebarItem
        href="/settings/profile"
        name="Profile"
        highlighted={pathname.split("/")[2] === "profile"}
      />
      <Setting.SidebarItem
        href="/settings/account"
        name="Account"
        highlighted={pathname.split("/")[2] === "account"}
      />
      <Setting.SidebarItem
        href="/settings/api-tokens"
        name="API Tokens"
        highlighted={pathname.split("/")[2] === "api-tokens"}
      />
    </Setting.SidebarRoot>
  );
};
