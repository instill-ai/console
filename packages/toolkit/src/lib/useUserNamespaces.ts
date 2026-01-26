"use client";

import * as React from "react";

import { useAuthenticatedUser } from "./react-query-service";
import { Nullable } from "./type";
import { InstillStore, useInstillStore, useShallow } from "./use-instill-store";

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
  email: Nullable<string>;
  userCount: Nullable<number>;
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

// NOTE: Organizations are EE-only. In CE, this hook only returns the user namespace.
export function useUserNamespaces(): UseUserNamespacesReturn {
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [namespaces, setNamespaces] =
    React.useState<Nullable<UserNamespace[]>>(null);
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const me = useAuthenticatedUser({
    enabled: enabledQuery,
    accessToken,
  });

  React.useEffect(() => {
    if (!me.isSuccess) {
      return;
    }

    const userNamespaces: UserNamespace[] = [
      {
        id: me.data.id,
        name: me.data.name,
        type: "user",
        avatarUrl: me.data.profile?.avatar ?? null,
        displayName:
          me.data.displayName ?? me.data.profile?.displayName ?? null,
        email: me.data.email ?? null,
        userCount: null,
      },
    ];

    setNamespaces(userNamespaces);
    setIsSuccess(true);
  }, [me.isSuccess, me.data]);

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
