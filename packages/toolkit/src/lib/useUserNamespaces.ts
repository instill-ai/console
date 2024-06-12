"use client";
import * as React from "react";

import {
  useAuthenticatedUser,
  useUserMemberships,
} from "./react-query-service";
import { InstillStore, useInstillStore, useShallow } from "./use-instill-store";
import { Nullable } from "./type";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export type UserNamespace = {
  id: string;
  name: string;
  displayName: Nullable<string>;
  type: "user" | "organization";
  avatarUrl: Nullable<string>;
};

export function useUserNamespaces() {
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const me = useAuthenticatedUser({
    enabled: enabledQuery,
    accessToken,
  });

  const userMemberships = useUserMemberships({
    enabled: me.isSuccess,
    userID: me.isSuccess ? me.data.id : null,
    accessToken,
  });

  const namespaces = React.useMemo(() => {
    const orgsAndUserList: UserNamespace[] = [];

    if (userMemberships.isSuccess) {
      userMemberships.data.forEach((org) => {
        orgsAndUserList.push({
          id: org.organization.id,
          name: org.organization.name,
          type: "organization",
          avatarUrl: org.organization.profile?.avatar ?? null,
          displayName: org.organization.profile?.display_name ?? null,
        });
      });
    }

    if (me.isSuccess && me.data.id && me.data.name) {
      orgsAndUserList.push({
        id: me.data.id,
        name: me.data.name,
        type: "user",
        avatarUrl: me.data.profile?.avatar ?? null,
        displayName: me.data.profile?.display_name ?? null,
      });
    }

    return orgsAndUserList;
  }, [userMemberships.isSuccess, userMemberships.data, me.isSuccess, me.data]);

  return namespaces;
}
