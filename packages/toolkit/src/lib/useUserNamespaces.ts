"use client";

import * as React from "react";

import {
  useAuthenticatedUser,
  useUserMemberships,
} from "./react-query-service";
import { Nullable } from "./type";
import { InstillStore, useInstillStore, useShallow } from "./use-instill-store";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export type UserNamespace = {
  id: string;
  uid: string;
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
    let orgsAndUserList: UserNamespace[] = [];

    if (userMemberships.isSuccess) {
      userMemberships.data
        .filter((org) => org.state === "MEMBERSHIP_STATE_ACTIVE")
        .sort((a, b) => {
          if (a.organization.name < b.organization.name) {
            return -1;
          }
          if (a.organization.name > b.organization.name) {
            return 1;
          }
          return 0;
        })
        .forEach((org) => {
          if (
            orgsAndUserList.findIndex((e) => e.id === org.organization.id) ===
            -1
          ) {
            orgsAndUserList.push({
              id: org.organization.id,
              uid: org.organization.uid,
              name: org.organization.name,
              type: "organization",
              avatarUrl: org.organization.profile?.avatar ?? null,
              displayName: org.organization.profile?.displayName ?? null,
            });
          }
        });
    }

    if (
      me.isSuccess &&
      me.data.id &&
      me.data.name &&
      orgsAndUserList.findIndex((e) => e.id === me.data.id) === -1
    ) {
      orgsAndUserList = [
        {
          id: me.data.id,
          uid: me.data.uid,
          name: me.data.name,
          type: "user",
          avatarUrl: me.data.profile?.avatar ?? null,
          displayName: me.data.profile?.displayName ?? null,
        },
        ...orgsAndUserList,
      ];
    }

    return orgsAndUserList;
  }, [userMemberships.isSuccess, userMemberships.data, me.isSuccess, me.data]);

  return namespaces;
}
