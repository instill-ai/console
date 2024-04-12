"use client";

import * as React from "react";
import { PageTitle } from "../../components";
import { GeneralAppPageProp, useAppEntity, useUserConnector } from "../../lib";
import { AIResourceAutoForm } from "../ai";
import { ApplicationResourceAutoForm } from "../application";
import { AirbyteDataResourceForm, DataResourceAutoForm } from "../data";
import { useParams } from "next/navigation";

export type ResourceSettingPageMainViewProps = GeneralAppPageProp;

export const ResourceSettingPageMainView = (
  props: ResourceSettingPageMainViewProps
) => {
  const { accessToken, enableQuery, router } = props;
  const { id } = useParams();

  const entintyObject = useAppEntity();

  const userConnector = useUserConnector({
    connectorName: entintyObject.data.connectorName,
    enabled: enableQuery && entintyObject.isSuccess,
    accessToken: accessToken,
  });

  // Guard this page
  React.useEffect(() => {
    if (userConnector.isError) {
      router.push("/404");
    }
  }, [userConnector.isError, router]);

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/

  return (
    <div className="flex flex-col">
      <PageTitle
        title={`${id?.toString()}`}
        breadcrumbs={["Connectors", "Connector Settings"]}
        className="mb-5"
      />
      {userConnector.isSuccess ? (
        <React.Fragment>
          {userConnector.data.type === "CONNECTOR_TYPE_AI" ? (
            <AIResourceAutoForm
              definition={userConnector.data.connector_definition}
              resource={userConnector.data}
              accessToken={accessToken}
              entityName={entintyObject.data.entityName}
            />
          ) : null}
          {userConnector.data.type === "CONNECTOR_TYPE_APPLICATION" ? (
            <ApplicationResourceAutoForm
              definition={userConnector.data.connector_definition}
              resource={userConnector.data}
              accessToken={accessToken}
              entityName={entintyObject.data.entityName}
            />
          ) : null}
          {userConnector.data.type === "CONNECTOR_TYPE_DATA" ? (
            userConnector.data.connector_definition.id ===
            "airbyte-destination" ? (
              <AirbyteDataResourceForm
                dataDefinition={userConnector.data.connector_definition}
                dataResource={userConnector.data}
                accessToken={accessToken}
                enableBackButton={false}
                enableQuery={enableQuery}
                entityName={entintyObject.data.entityName}
              />
            ) : (
              <DataResourceAutoForm
                definition={userConnector.data.connector_definition}
                resource={userConnector.data}
                accessToken={accessToken}
                entityName={entintyObject.data.entityName}
              />
            )
          ) : null}
        </React.Fragment>
      ) : (
        <div className="flex h-[300px] w-full items-center justify-center rounded-md border border-semantic-bg-line text-semantic-fg-primary product-body-text-3-semibold">
          loading...
        </div>
      )}
    </div>
  );
};
