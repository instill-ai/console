"use client";

import { Nullable } from "@instill-ai/design-system";

import { Integrations, Setting } from "../..";
import { GeneralAppPageProp } from "../../../lib";

export type UserIntegrationsTabProps = GeneralAppPageProp & {
  namespaceId: Nullable<string>;
};

export const UserIntegrationsTab = (props: UserIntegrationsTabProps) => {
  const { accessToken, enableQuery, namespaceId } = props;

  return (
    <Setting.TabRoot>
      <Setting.TabHeader
        title="Integration"
        description="Easily configure and protect your connections"
      />
      <Integrations
        accessToken={accessToken}
        enableQuery={enableQuery}
        namespaceId={namespaceId}
      />
    </Setting.TabRoot>
  );
};
