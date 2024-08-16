"use client";

import * as React from "react";

import { Setting } from "..";
import { GeneralAppPageProp, useApiTokens } from "../../../lib";
import { env } from "../../../server";
import {
  APITokenTable,
  CreateAPITokenDialog,
  SelectOrganization,
} from "../api-tokens";

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
      {env("NEXT_PUBLIC_APP_ENV") !== "CE" ? <SelectOrganization /> : null}
      <div className="flex flex-col px-8 pt-12">
        <div className="mb-6 flex flex-row-reverse">
          <CreateAPITokenDialog />
        </div>
        {/*  */}
        <div className="w-full [&_table]:table-fixed [&_table_th:nth-child(1)]:w-32 [&_table_th:nth-child(2)]:w-auto [&_table_th:nth-child(3)]:w-36 [&_table_th:nth-child(4)]:w-36 [&_table_th:nth-child(5)]:w-28">
          <APITokenTable
            isError={apiTokens.isError}
            isLoading={apiTokens.isLoading}
            tokens={apiTokens.data ?? []}
          />
        </div>
      </div>
    </Setting.TabRoot>
  );
};
