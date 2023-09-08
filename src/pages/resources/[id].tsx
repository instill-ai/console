import { FC, ReactElement } from "react";
import { useRouter } from "next/router";

import { PageTitle, PageHead, Topbar, Sidebar, PageBase } from "@/components";
import { Logo } from "@instill-ai/design-system";
import { useUser, useUserConnectorResource } from "@instill-ai/toolkit";
import {
  AIResourceForm,
  BlockchainResourceForm,
  DataResourceForm,
} from "pipeline-builder/components";

type GetLayOutProps = {
  page: ReactElement;
};

const ResourceDetailsPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const router = useRouter();

  const { id } = router.query;

  const user = useUser({
    enabled: true,
    accessToken: null,
  });

  const userConnectorResource = useUserConnectorResource({
    connectorResourceName: user.isSuccess
      ? `users/${user.data.id}/connector-resources/${id}`
      : null,
    enabled: user.isSuccess && !!id,
    accessToken: null,
  });

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/

  return (
    <>
      <PageHead title={`resources/${id}`} />
      <div className="flex flex-col">
        <PageTitle
          title={`${id?.toString()}`}
          breadcrumbs={id ? ["Resource", id.toString()] : ["Resource"]}
          disabledButton={true}
          marginBottom="mb-5"
        />
        {userConnectorResource.isSuccess ? (
          <>
            {userConnectorResource.data.type === "CONNECTOR_TYPE_AI" ? (
              <AIResourceForm
                aiDefinition={userConnectorResource.data.connector_definition}
                aiResource={userConnectorResource.data}
                accessToken={null}
                enableBackButton={false}
              />
            ) : null}
            {userConnectorResource.data.type === "CONNECTOR_TYPE_BLOCKCHAIN" ? (
              <BlockchainResourceForm
                blockchainDefinition={
                  userConnectorResource.data.connector_definition
                }
                blockchainResource={userConnectorResource.data}
                accessToken={null}
                enableBackButton={false}
              />
            ) : null}
            {userConnectorResource.data.type === "CONNECTOR_TYPE_DATA" ? (
              <DataResourceForm
                dataDefinition={userConnectorResource.data.connector_definition}
                dataResource={userConnectorResource.data}
                accessToken={null}
                enableBackButton={false}
              />
            ) : null}
          </>
        ) : (
          <div className="flex h-[300px] w-full items-center justify-center rounded-md border border-semantic-bg-line">
            loading...
          </div>
        )}
      </div>
    </>
  );
};

ResourceDetailsPage.getLayout = (page) => {
  return (
    <PageBase>
      <Topbar logo={<Logo variant="ColourLogomarkWhiteType" width={180} />} />
      <PageBase.Container>
        <Sidebar />
        <PageBase.Content>{page}</PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};

export default ResourceDetailsPage;
