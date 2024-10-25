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

export type UseUserNamespacesReturn =
  | {
      isSuccess: true;
      data: UserNamespace[];
    }
  | {
      isSuccess: false;
      data: null;
    };

export function useUserNamespaces(): UseUserNamespacesReturn {
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [namespaces, setNamespaces] =
    React.useState<Nullable<UserNamespace[]>>(null);
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const me = useAuthenticatedUser({
    enabled: enabledQuery,
    accessToken,
  });

  const userMemberships = useUserMemberships({
    enabled: me.isSuccess,
    userId: me.isSuccess ? me.data.id : null,
    accessToken,
  });

  React.useEffect(() => {
    const orgsAndUserList: UserNamespace[] = [];

    if (!userMemberships.isSuccess || !me.isSuccess) {
      return;
    }

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
          orgsAndUserList.findIndex((e) => e.id === org.organization.id) === -1
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

    if (orgsAndUserList.findIndex((e) => e.id === me.data.id) === -1) {
      orgsAndUserList.push({
        id: me.data.id,
        uid: me.data.uid,
        name: me.data.name,
        type: "user",
        avatarUrl: me.data.profile?.avatar ?? null,
        displayName: me.data.profile?.displayName ?? null,
      });
    }

    setNamespaces(orgsAndUserList);
    setIsSuccess(true);
  }, [userMemberships.isSuccess, userMemberships.data, me.isSuccess, me.data]);

  if (isSuccess) {
    return {
      isSuccess: true,
      data: namespaces ?? [],
    };
  } else {
    return {
      isSuccess: false,
      data: null,
    };
  }
}
