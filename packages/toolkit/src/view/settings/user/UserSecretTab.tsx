"use client";

import * as React from "react";
import { Setting } from "..";
import {
  GeneralAppPageProp,
  InstillStore,
  useApiTokens,
  useAppEntity,
  useAuthenticatedUser,
  useInstillStore,
  useShallow,
  useUserSecrets,
} from "../../../lib";
import { APITokenTable, CreateAPITokenDialog } from "../api-tokens";
import { useRouter } from "next/navigation";
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

  const secrets = useUserSecrets({
    accessToken,
    enabled: enabledQuery && me.isSuccess,
    entityName: me.data?.name ?? null,
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
        <div className="w-full">
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
