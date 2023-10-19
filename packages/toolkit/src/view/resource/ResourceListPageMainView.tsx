import * as React from "react";
import { AddConnectorResourceDialog } from "./AddConnectorResourceDialog";
import { GeneralPageProp, useUserConnectorResources } from "../../lib";
import dynamic from "next/dynamic";

const ResourcesTable = dynamic(
  () => import("./ResourcesTable").then((mod) => mod.ResourcesTable),
  { ssr: false }
);

export type ResourceListPageMainViewProps = GeneralPageProp;

export const ResourceListPageMainView = (
  props: ResourceListPageMainViewProps
) => {
  const { enableQuery, accessToken, router } = props;
  const { entity } = router.query;
  const [addConnectorDialogIsOpen, setAddConnectorDialogIsOpen] =
    React.useState(false);

  /* -------------------------------------------------------------------------
   * Query resource data
   * -----------------------------------------------------------------------*/

  const userConnectorResources = useUserConnectorResources({
    userName: `users/${entity}`,
    enabled: enableQuery,
    connectorResourceType: "all",
    accessToken,
  });

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/

  return (
    <div className="flex flex-col">
      <div className="mb-8 flex">
        <AddConnectorResourceDialog
          open={addConnectorDialogIsOpen}
          onOpenChange={(open) => setAddConnectorDialogIsOpen(open)}
          accessToken={accessToken}
          onSubmit={() => {
            setAddConnectorDialogIsOpen(false);
          }}
          enableQuery={enableQuery}
        />
      </div>
      <ResourcesTable
        connectorResources={
          userConnectorResources.isSuccess ? userConnectorResources.data : []
        }
        isError={userConnectorResources.isError}
        isLoading={userConnectorResources.isLoading}
        accessToken={accessToken}
      />
    </div>
  );
};
