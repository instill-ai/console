import { IntegrationConnection, Nullable } from "instill-sdk";

import { GeneralDeleteResourceDialog } from "../../../../components";
import {
  InstillStore,
  useDeleteIntegrationConnection,
  useInstillStore,
  useShallow,
} from "../../../../lib";

const selector = (state: InstillStore) => ({
  accessToken: state.accessToken,
});

export const DeleteConnectionDialog = ({
  deletingConnection,
  setDeletingConnection,
  namespaceId,
}: {
  deletingConnection: Nullable<IntegrationConnection>;
  setDeletingConnection: (connection: Nullable<IntegrationConnection>) => void;
  namespaceId: Nullable<string>;
}) => {
  const deleteIntegrationConnection = useDeleteIntegrationConnection();
  const { accessToken } = useInstillStore(useShallow(selector));

  return (
    <GeneralDeleteResourceDialog
      open={deletingConnection !== null}
      onOpenChange={(open) => {
        if (!open) {
          setDeletingConnection(null);
        }
      }}
      resourceID={deletingConnection?.id || ""}
      title={`Delete ${deletingConnection?.id}`}
      description="This action cannot be undone. This will permanently delete this connection."
      handleDeleteResource={async () => {
        if (!namespaceId || !deletingConnection) {
          return;
        }

        await deleteIntegrationConnection.mutateAsync({
          namespaceId,
          connectionId: deletingConnection.id,
          accessToken,
        });

        setDeletingConnection(null);
      }}
      trigger={null}
    />
  );
};
