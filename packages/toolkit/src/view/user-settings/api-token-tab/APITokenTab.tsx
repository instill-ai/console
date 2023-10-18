import { Nullable, useApiTokens } from "../../../lib";
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
    <div className="flex min-w-[720px] w-full flex-col gap-y-4">
      <div className="flex w- mb-3 justify-end">
        <CreateAPITokenDialog accessToken={accessToken} />
      </div>
      <APITokenTable
        isError={apiTokens.isError}
        isLoading={apiTokens.isLoading}
        accessToken={accessToken}
        tokens={apiTokens.data ?? []}
      />
    </div>
  );
};
