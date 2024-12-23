"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Setting } from "..";
import {
  InstillStore,
  useAuthenticatedUser,
  useInstillStore,
  useNamespaceSecrets,
  useShallow,
} from "../../../lib";
import { CreateSecretDialog, SecretTable } from "../secrets";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const UserSecretTab = () => {
  const router = useRouter();
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const me = useAuthenticatedUser({
    accessToken,
    enabled: enabledQuery,
  });

  const secrets = useNamespaceSecrets({
    namespaceId: me.data?.id ?? null,
    accessToken,
    enabled: enabledQuery && me.isSuccess,
  });

  React.useEffect(() => {
    if (secrets.isError) {
      // router.push("/404");
    }
  }, [secrets.isError, router]);

  return (
    <Setting.TabRoot>
      <Setting.TabHeader title="Secrets" description="Manage your secrets" />
      <div className="flex flex-col px-8 pt-12">
        <div className="mb-6 flex flex-row-reverse">
          <CreateSecretDialog />
        </div>
        <div className="w-full [&_table]:table-fixed [&_table_th:nth-child(1)]:auto [&_table_th:nth-child(2)]:w-36 [&_table_th:nth-child(3)]:w-28">
          <SecretTable
            isError={secrets.isError}
            isLoading={secrets.isLoading}
            secrets={secrets.data ?? []}
          />
        </div>
      </div>
    </Setting.TabRoot>
  );
};
