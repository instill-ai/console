"use client";

import { useRouter } from "next/router";
import { Setting } from "..";

export const UserSidebar = () => {
  const router = useRouter();

  return (
    <Setting.SidebarRoot>
      <Setting.SidebarItem
        href="/settings/profile"
        name="Profile"
        highlighted={router.pathname.split("/")[2] === "profile"}
      />
      <Setting.SidebarItem
        href="/settings/account"
        name="Account"
        highlighted={router.pathname.split("/")[2] === "account"}
      />
      <Setting.SidebarItem
        href="/settings/api-tokens"
        name="API Tokens"
        highlighted={router.pathname.split("/")[2] === "api-tokens"}
      />
    </Setting.SidebarRoot>
  );
};
