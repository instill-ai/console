"use client";

import * as React from "react";
import { Setting } from "..";
import { GeneralAppPageProp, useApiTokens } from "../../../lib";
import { APITokenTable, CreateAPITokenDialog } from "../api-tokens";

export type UserAPITokenTabProps = GeneralAppPageProp;

export const UserAPITokenTab = (props: UserAPITokenTabProps) => {
  const { accessToken, enableQuery, router } = props;

  const apiTokens = useApiTokens({
    accessToken,
    enabled: enableQuery,
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
