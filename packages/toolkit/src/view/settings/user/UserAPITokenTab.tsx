"use client";

import * as React from "react";
import { Setting } from "..";
import {
  InstillStore,
  useApiTokens,
  useInstillStore,
  useShallow,
} from "../../../lib";
import { APITokenTable, CreateAPITokenDialog } from "../api-tokens";
import { useRouter } from "next/router";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const UserAPITokenTab = () => {
  const router = useRouter();
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const apiTokens = useApiTokens({
    accessToken,
    enabled: enabledQuery,
  });

  React.useEffect(() => {
    if (apiTokens.isError) {
      router.push("/404");
    }
  }, [apiTokens.isError, router]);

  return (
    <Setting.TabRoot>
      <Setting.TabHeader
        title="API Tokens"
        description="Manage your API Tokens"
      />
      <div className="flex flex-col px-8 pt-12">
        <div className="mb-6 flex flex-row-reverse">
          <CreateAPITokenDialog accessToken={accessToken} />
        </div>
        <div className="w-full">
          <APITokenTable
            isError={apiTokens.isError}
            isLoading={apiTokens.isLoading}
            accessToken={accessToken}
            tokens={apiTokens.data ?? []}
          />
        </div>
      </div>
    </Setting.TabRoot>
  );
};
