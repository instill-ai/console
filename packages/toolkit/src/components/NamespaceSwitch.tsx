"use client";

import * as React from "react";

import { Icons, Select, Tag, Separator } from "@instill-ai/design-system";
import { EntityAvatar } from "./EntityAvatar";
import { UserNamespace, useUserNamespaces } from "../lib/useUserNamespaces";
import {
  InstillStore,
  Nullable,
  getCaptializeTwoWordsFromName,
  useGuardPipelineBuilderUnsavedChangesNavigation,
  useInstillStore,
  useNamespacesRemainingCredit,
  useShallow,
} from "../lib";
import { env } from "../server";

const truncateDisplayName = (value?: string) => {
  if (value && value.length >= 10) {
    return `${value?.slice(0, 10)}...`;
  }

  return value;
};

type NamespaceWithCredit = UserNamespace & {
  remainingCredit?: number;
};

const selector = (store: InstillStore) => ({
  navigationNamespaceAnchor: store.navigationNamespaceAnchor,
  updateNavigationNamespaceAnchor: store.updateNavigationNamespaceAnchor,
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const NamespaceSwitch = () => {
  const {
    navigationNamespaceAnchor,
    updateNavigationNamespaceAnchor,
    accessToken,
    enabledQuery,
  } = useInstillStore(useShallow(selector));
  const [selectedNamespace, setSelectedNamespace] =
    React.useState<Nullable<NamespaceWithCredit>>(null);
  const [namespacesWithRemainingCredit, setNamespacesWithRemainingCredit] =
    React.useState<Nullable<NamespaceWithCredit[]>>(null);
  const navigate = useGuardPipelineBuilderUnsavedChangesNavigation();

  const namespaces = useUserNamespaces();
  const namespacesRemainingCredit = useNamespacesRemainingCredit({
    namespaceNames: namespaces.map((e) => e.name),
    accessToken,
    enabled: enabledQuery,
  });

  React.useEffect(() => {
    if (env("NEXT_PUBLIC_APP_ENV") === "CLOUD") {
      if (!namespacesRemainingCredit.isSuccess) {
        return;
      }

      setNamespacesWithRemainingCredit(
        namespaces.map((e) => ({
          ...e,
          remainingCredit:
            namespacesRemainingCredit.data.find(
              (credit) => credit.namespaceName === e.name
            )?.remainingCredit ?? 0,
        }))
      );

      if (!navigationNamespaceAnchor) {
        const userNamespace = namespaces.find((e) => e.type === "user");

        if (userNamespace) {
          updateNavigationNamespaceAnchor(() => userNamespace.id);

          const namespaceRemainingCredit = namespacesRemainingCredit.data.find(
            (e) => e.namespaceName === userNamespace?.name
          );

          setSelectedNamespace({
            ...userNamespace,
            remainingCredit: namespaceRemainingCredit?.remainingCredit ?? 0,
          });
        }
      } else {
        const selectedNamespace = namespaces.find(
          (e) => e.id === navigationNamespaceAnchor
        );

        console.log(selectedNamespace, namespacesRemainingCredit.data);

        if (selectedNamespace) {
          const namespaceRemainingCredit = namespacesRemainingCredit.data.find(
            (e) => e.namespaceName === selectedNamespace.name
          );

          setSelectedNamespace({
            ...selectedNamespace,
            remainingCredit: namespaceRemainingCredit?.remainingCredit ?? 0,
          });
        }
      }
    } else {
      setNamespacesWithRemainingCredit(namespaces);

      if (!navigationNamespaceAnchor) {
        const userNamespace = namespaces.find((e) => e.type === "user");
        if (userNamespace) {
          updateNavigationNamespaceAnchor(() => userNamespace.id);

          setSelectedNamespace(userNamespace);
        }
      } else {
        const selectedNamespace = namespaces.find(
          (e) => e.id === navigationNamespaceAnchor
        );

        if (selectedNamespace) {
          setSelectedNamespace(selectedNamespace);
        }
      }
    }
  }, [namespaces, navigationNamespaceAnchor, namespacesRemainingCredit]);

  console.log(namespacesRemainingCredit);

  return (
    <Select.Root
      value={navigationNamespaceAnchor ?? ""}
      onValueChange={(value) => {
        updateNavigationNamespaceAnchor(() => value);
      }}
    >
      <Select.Trigger
        icon={
          <Icons.ChevronSelectorVertical className="h-4 w-4 stroke-semantic-fg-primary" />
        }
        className="!w-[150px] !border-none !bg-semantic-bg-secondary"
      >
        <Select.Value placeholder="Select Model Owner" asChild>
          {selectedNamespace ? (
            <div className="flex flex-row items-center gap-x-2">
              <EntityAvatar
                src={selectedNamespace.avatarUrl ?? null}
                className="h-8 w-8 rounded-full"
                fallbackImg={
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-semantic-bg-line">
                    <p className="font-sans text-[11px] font-semibold text-semantic-fg-secondary">
                      {selectedNamespace.displayName
                        ? getCaptializeTwoWordsFromName(
                            selectedNamespace.displayName
                          )
                        : getCaptializeTwoWordsFromName(selectedNamespace.id)}
                    </p>
                  </div>
                }
                entityName={selectedNamespace.id ?? ""}
              />
              <p className="text-semantic-fg-primary product-body-text-3-medium">
                {truncateDisplayName(selectedNamespace.id)}
              </p>
            </div>
          ) : null}
        </Select.Value>
      </Select.Trigger>
      <Select.Content viewportClassName="!p-0" className="!w-[240px] !p-0">
        <div className="flex flex-col">
          <div className="flex flex-col py-3">
            {namespacesWithRemainingCredit
              ? namespacesWithRemainingCredit.map((namespace) => {
                  return (
                    <Select.Item
                      className="!px-4 !py-0"
                      tailCheck={true}
                      value={namespace.id}
                      key={namespace.id}
                    >
                      <div className="flex flex-row items-center gap-x-3">
                        <EntityAvatar
                          src={namespace.avatarUrl ?? null}
                          className="h-10 w-10 rounded-full"
                          fallbackImg={
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-semantic-bg-line">
                              <p className="font-sans text-base font-semibold text-semantic-secondary-bg">
                                {namespace.displayName
                                  ? getCaptializeTwoWordsFromName(
                                      namespace.displayName
                                    )
                                  : getCaptializeTwoWordsFromName(namespace.id)}
                              </p>
                            </div>
                          }
                          entityName={namespace.id ?? ""}
                        />
                        <div className="flex flex-col">
                          <p className="text-semantic-fg-primary product-body-text-3-medium">
                            {namespace.id}
                          </p>
                          {namespace.remainingCredit ? (
                            <Tag variant="lightBlue" size="sm">
                              <Icons.Coins01 className="h-2.5 w-2.5 stroke-semantic-accent-default" />
                              {`${namespace.remainingCredit.toLocaleString("en-US", { style: "decimal" })} credits left`}
                            </Tag>
                          ) : null}
                        </div>
                      </div>
                    </Select.Item>
                  );
                })
              : null}
          </div>
          {env("NEXT_PUBLIC_APP_ENV") === "CLOUD" ? (
            <React.Fragment>
              <Separator orientation="horizontal" />
              <div className="w-full p-1.5">
                <button
                  onClick={() => {
                    navigate("/settings/organizations/new");
                  }}
                  className="w-full cursor-pointer p-2.5 product-body-text-3-medium hover:bg-semantic-bg-base-bg hover:!text-black"
                >
                  <div className="flex flex-row items-center gap-x-2">
                    <Icons.Plus className="h-4 w-4 stroke-semantic-fg-disabled" />
                    <p className="mr-0.5">Create Organization</p>
                  </div>
                </button>
              </div>
            </React.Fragment>
          ) : null}
        </div>
      </Select.Content>
    </Select.Root>
  );
};
