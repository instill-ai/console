import { Nullable, useApiTokens } from "../../../lib";
import { TabBase } from "../TabBase";
import { APITokenTable } from "./APITokenTable";
import { CreateAPITokenDialog } from "./CreateAPITokenDialog";

export type APITokenTabProps = {
  accessToken: Nullable<string>;
  enableQuery: boolean;
};

export const APITokenTab = (props: APITokenTabProps) => {
  const { accessToken, enableQuery } = props;

  const apiTokens = useApiTokens({
    accessToken,
    enabled: enableQuery,
  });

  return (
    <TabBase title="API Tokens" description="Manage your API Tokens">
      <div className="flex w-full min-w-[720px] flex-col gap-y-4">
        <div className="w- mb-3 flex justify-end">
          <CreateAPITokenDialog accessToken={accessToken} />
        </div>
        <APITokenTable
          isError={apiTokens.isError}
          isLoading={apiTokens.isLoading}
          accessToken={accessToken}
          tokens={apiTokens.data ?? []}
        />
      </div>
    </TabBase>
  );
};
