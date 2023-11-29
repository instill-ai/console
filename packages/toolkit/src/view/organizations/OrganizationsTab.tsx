import { Button, Icons, Logos, Skeleton } from "@instill-ai/design-system";
import { Nullable, useOrganizations, useUser } from "../../lib";
import { TabBase } from "../user-settings/TabBase";
import { CreateOrganizationDialog } from "./CreateOrganizationDialog";
import Link from "next/link";
import React from "react";

export type OrganizationsTabProps = {
  accessToken: Nullable<string>;
  enableQuery: boolean;
};

export const OrganizationsTab = (props: OrganizationsTabProps) => {
  const { accessToken, enableQuery } = props;

  const user = useUser({
    enabled: enableQuery,
    accessToken,
  });

  const organisations = useOrganizations({
    enabled: enableQuery && user.isSuccess,
    accessToken,
  });

  return (
    <div className="flex flex-col">
      <div className="mb-6">
        <div className="flex flex-row">
          <div className="flex w-5/6 flex-col">
            <p className="text-lg font-semibold leading-7 text-[#101828]">
              Organization
            </p>
            <p className="mb-5 text-sm font-normal leading-5 text-[#475467]">
              Manage your organisations
            </p>
          </div>
          <div className="mb-3 flex h-10 w-1/5 justify-end">
            <CreateOrganizationDialog accessToken={accessToken} />
          </div>
        </div>
        <div className="border-b border-b-[#EAECF0]" />
      </div>

      {organisations.isLoading ? (
        <React.Fragment>
          <div className="mb-6 flex items-center space-x-4 rounded-sm border border-[#E4E4E4] p-4">
            <Skeleton className="h-12 w-12 rounded" />
            <div className="w-3/4 space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
            <div className="flex w-1/4 justify-end gap-x-6">
              <div className="my-auto">
                <Skeleton className="h-6 w-[40px]" />
              </div>
              <div className="my-auto">
                <Skeleton className="h-6 w-[150px]" />
              </div>
            </div>
          </div>
          <div className="mb-6 flex items-center space-x-4 rounded-sm border border-[#E4E4E4] p-4">
            <Skeleton className="h-12 w-12 rounded" />
            <div className="w-3/4 space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
            <div className="flex w-1/4 justify-end gap-x-6">
              <div className="my-auto">
                <Skeleton className="h-6 w-[40px]" />
              </div>
              <div className="my-auto">
                <Skeleton className="h-6 w-[150px]" />
              </div>
            </div>
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          {organisations.isSuccess && organisations.data.length ? (
            <div className="flex flex-col space-y-6">
              {/* Org 1 */}

              {organisations.data.map((organisation) => (
                <div className="rounded-sm border border-[#E4E4E4] p-4">
                  <div className="flex w-full flex-row">
                    <div className="flex w-3/4 gap-x-3">
                      <div className="my-auto">
                        <Link href={`/organization/${organisation.id}`}>
                          <Button
                            variant="secondaryGrey"
                            size="lg"
                            className="!p-3.5"
                          >
                            <Logos.OpenAI className="h-7 w-7" />
                          </Button>
                        </Link>
                      </div>

                      <div className="my-auto">
                        <Link href={`/organization/${organisation.id}`}>
                          <p className="text-semantic-fg-primary product-body-text-2-semibold">
                            {organisation.org_name}
                          </p>
                        </Link>
                        <p className="text-semantic-fg-disabled product-body-text-4-regular">
                          Company
                        </p>
                      </div>
                    </div>

                    <div className="flex w-1/4 justify-end gap-x-2">
                      <div className="my-auto">
                        <Link
                          href={`/organization/${organisation.id}/settings`}
                        >
                          <Button
                            variant="secondaryGrey"
                            size="lg"
                            className="!p-2"
                          >
                            <Icons.Gear01 className="h-4 w-4 stroke-slate-500" />
                          </Button>
                        </Link>
                      </div>

                      <div className="my-auto">
                        <Button variant="tertiaryDanger" size="lg">
                          leave organisation
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {/* Org 2 */}
            </div>
          ) : (
            <div>
              <p className="text-semantic-fg-disabled product-headings-heading-5">
                No organisations created yet
              </p>
            </div>
          )}
        </React.Fragment>
      )}
    </div>
  );
};
