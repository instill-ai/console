import { PageTitle } from "../../components";
import { GeneralPageProp, useUserConnectorResource } from "../../lib";
import { AIResourceForm } from "../ai";
import { BlockchainResourceForm } from "../blockchain";
import { DataResourceForm } from "../data";

export type ResourceSettingPageMainViewProps = GeneralPageProp;

export const ResourceSettingPageMainView = (
  props: ResourceSettingPageMainViewProps
) => {
  const { accessToken, enableQuery, router } = props;
  const { id, entity } = router.query;

  const userConnectorResource = useUserConnectorResource({
    connectorResourceName: `users/${entity}/connector-resources/${id?.toString()}`,
    enabled: enableQuery && !!id,
    accessToken: accessToken,
  });

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/

  return (
    <div className="flex flex-col">
      <PageTitle
        title={`${id?.toString()}`}
        breadcrumbs={["Resources", "Resource Settings"]}
        className="mb-5"
      />
      {userConnectorResource.isSuccess ? (
        <>
          {userConnectorResource.data.type === "CONNECTOR_TYPE_AI" ? (
            <AIResourceForm
              aiDefinition={userConnectorResource.data.connector_definition}
              aiResource={userConnectorResource.data}
              accessToken={accessToken}
              enableBackButton={false}
              enableQuery={enableQuery}
            />
          ) : null}
          {userConnectorResource.data.type === "CONNECTOR_TYPE_BLOCKCHAIN" ? (
            <BlockchainResourceForm
              blockchainDefinition={
                userConnectorResource.data.connector_definition
              }
              blockchainResource={userConnectorResource.data}
              accessToken={accessToken}
              enableBackButton={false}
              enableQuery={enableQuery}
            />
          ) : null}
          {userConnectorResource.data.type === "CONNECTOR_TYPE_DATA" ? (
            <DataResourceForm
              dataDefinition={userConnectorResource.data.connector_definition}
              dataResource={userConnectorResource.data}
              accessToken={accessToken}
              enableBackButton={false}
              enableQuery={enableQuery}
            />
          ) : null}
        </>
      ) : (
        <div className="flex h-[300px] w-full items-center justify-center rounded-md border border-semantic-bg-line text-semantic-fg-primary product-body-text-3-semibold">
          loading...
        </div>
      )}
    </div>
  );
};
