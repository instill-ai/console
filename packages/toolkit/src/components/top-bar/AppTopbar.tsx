"use client";

import * as React from "react";
import cn from "clsx";

import {
  InstillStore,
  useAuthenticatedUser,
  useInstillStore,
  useShallow,
} from "../../lib";
import { CloudTopbarDropdown } from "./CloudTopbarDropdown";
import { CETopbarDropdown } from "./CETopbarDropdown";
import { env } from "../../server";
import { useRouter } from "next/navigation";
import { useGuardPipelineBuilderUnsavedChangesNavigation } from "../../lib/hook";
import { Button, Logo } from "@instill-ai/design-system";
import { NamespaceSwitch } from "./NamespaceSwitch";
import { NavLinks } from "./NavLinks";
import { TopbarMiscLinks } from "./TopbarMiscLinks";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const AppTopbar = ({
  className,
  disabledUserDropdown,
  topbarControllerChildren,
  disabledTopbarNav,
}: {
  className?: string;
  disabledUserDropdown?: boolean;
  topbarControllerChildren?: React.ReactNode;
  disabledTopbarNav?: boolean;
}) => {
  const router = useRouter();
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const me = useAuthenticatedUser({
    enabled: enabledQuery,
    accessToken,
  });

  const navigate = useGuardPipelineBuilderUnsavedChangesNavigation();

  return (
    <div className="flex w-full flex-col">
      <div
        className={cn(
          "box-content flex h-[var(--topbar-controller-height)] flex-row justify-between bg-semantic-bg-primary px-8 py-px",
          className
        )}
      >
        <div className="flex flex-row">
          <div className="flex flex-row items-center gap-x-4">
            <button
              onClick={() => {
                if (env("NEXT_PUBLIC_APP_ENV") === "CLOUD") {
                  navigate("/hub");
                } else {
                  navigate(`/${me.data?.id}/pipelines`);
                }
              }}
            >
              <Logo variant="colourLogomark" width={32} />
            </button>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 22L17 2"
                stroke="#1D2433"
                strokeOpacity="0.65"
                strokeWidth="1.33"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {me.isSuccess ? (
              <NamespaceSwitch />
            ) : (
              <Button
                onClick={() => {
                  router.push("/api/auth/login");
                }}
                variant="secondaryColour"
                className="!my-auto"
                size="md"
              >
                Log In
              </Button>
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-row justify-end">
          {topbarControllerChildren ? (
            topbarControllerChildren
          ) : (
            <TopbarMiscLinks />
          )}
          {disabledUserDropdown ? null : (
            <div className="ml-4 flex">
              {env("NEXT_PUBLIC_APP_ENV") === "CLOUD" ? (
                <CloudTopbarDropdown />
              ) : (
                <CETopbarDropdown />
              )}
            </div>
          )}
        </div>
      </div>
      {disabledTopbarNav ? null : (
        <div className="box-border flex h-[var(--topbar-nav-height)] flex-row gap-x-6 border-b border-semantic-bg-line border-x-violet-50 px-8">
          <NavLinks />
        </div>
      )}
    </div>
  );
};
