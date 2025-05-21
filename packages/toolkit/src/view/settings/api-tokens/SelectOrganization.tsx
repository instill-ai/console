"use client";

import * as React from "react";
import Link from "next/link";
import { Nullable, UserMembership } from "instill-sdk";

import { Icons, Select } from "@instill-ai/design-system";

import { CodeBlock } from "../../../components";
import { defaultCodeSnippetStyles, DOCS_BASE_URL } from "../../../constant";
import {
  InstillStore,
  useAuthenticatedUser,
  useInstillStore,
  useShallow,
  useUserMemberships,
} from "../../../lib";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const SelectOrganization = () => {
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const me = useAuthenticatedUser({
    enabled: enabledQuery,
    accessToken,
  });

  const organizations = useUserMemberships({
    enabled: enabledQuery && me.isSuccess,
    userId: me.isSuccess ? me.data.id : null,
    accessToken,
  });

  const [selectedOrg, setSelectedOrg] = React.useState<Nullable<string>>(null);

  const getSelectedOrgUid = React.useCallback(
    (orgId: Nullable<string> | undefined): string => {
      if (!organizations.isSuccess) return "Loading...";
      const org = organizations.data.find(
        (membership) => membership.organization.id === orgId,
      );
      return org ? org.organization.uid : "Select an organization";
    },
    [organizations.isSuccess, organizations.data],
  );

  const codeString = React.useMemo(() => {
    return `--header "Instill-Requester-Uid: ${getSelectedOrgUid(selectedOrg)}"`;
  }, [selectedOrg, getSelectedOrgUid]);

  if (
    !organizations.isSuccess ||
    !organizations.data ||
    organizations.data.length === 0
  ) {
    return null;
  }

  return (
    <div className="flex gap-4 p-4 rounded border border-semantic-bg-line">
      <Icons.AlertCircle className="w-6 h-6 stroke-semantic-node-connector-on" />
      <div className="flex flex-col flex-1 gap-3">
        <p className="text-semantic-fg-secondary product-body-text-3-regular">
          API tokens are tied to individual users, not organizations. To charge
          an organization for an API request, include the{" "}
          <span className="product-body-text-3-medium">
            Instill-Requester-Uid
          </span>{" "}
          header. If you omit this header, personal credits will be used. For
          more details, refer to the{" "}
          <Link
            href={`${DOCS_BASE_URL}/core/token`}
            className="text-semantic-accent-default"
            target="_blank"
            rel="noopener noreferrer"
          >
            documentation
          </Link>
          .
        </p>
        <div className="flex gap-2 items-center">
          <p className="product-button-button-2 text-semantic-fg-secondary">
            Organization:
          </p>
          <Select.Root
            value={selectedOrg || undefined}
            onValueChange={setSelectedOrg}
          >
            <Select.Trigger className="flex gap-2 items-center px-2.5 py-1.5 text-xs leading-none bg-semantic-bg-primary rounded border border-semantic-bg-line min-w-[240px] text-semantic-fg-primary w-[280px]">
              <Select.Value placeholder="Select an organization" />
            </Select.Trigger>
            <Select.Content viewportClassName="!p-0">
              {organizations.data?.map((membership: UserMembership) => (
                <Select.Item
                  key={membership.organization.id}
                  value={membership.organization.id}
                >
                  <Select.ItemText>
                    {membership.organization.id}
                  </Select.ItemText>
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </div>
        <CodeBlock
          codeString={codeString}
          wrapLongLines={true}
          language="bash"
          customStyle={defaultCodeSnippetStyles}
        />
      </div>
    </div>
  );
};

export default SelectOrganization;
