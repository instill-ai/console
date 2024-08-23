import { Nullable } from "instill-sdk";

import { Icons } from "@instill-ai/design-system";

import {
  InstillStore,
  useAuthenticatedUserSubscription,
  useInstillStore,
  useOrganizationSubscription,
  useRouteInfo,
  useShallow,
} from "../../../lib";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const SubscribeCTA = () => {
  const routeInfo = useRouteInfo();

  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const userSub = useAuthenticatedUserSubscription({
    accessToken,
    enabled: enabledQuery && routeInfo.data.namespaceType === "NAMESPACE_USER",
  });

  const orgSub = useOrganizationSubscription({
    organizationID: routeInfo.data.namespaceId,
    accessToken,
    enabled:
      enabledQuery && routeInfo.data.namespaceType === "NAMESPACE_ORGANIZATION",
  });

  let redirectURL: Nullable<string> = null;

  if (
    routeInfo.data.namespaceType === "NAMESPACE_ORGANIZATION" &&
    orgSub.data?.plan === "PLAN_FREE"
  ) {
    redirectURL = `/${routeInfo.data.namespaceId}/organization-settings/billing/subscriptions/plan`;
  }

  if (
    routeInfo.data.namespaceType === "NAMESPACE_USER" &&
    userSub.data?.plan === "PLAN_FREE"
  ) {
    redirectURL = "/subscribe";
  }

  return redirectURL ? (
    <a
      rel="noopener noreferrer"
      target="_blank"
      className="flex py-[9px] rounded hover:bg-semantic-bg-alt-primary bg-semantic-bg-primary border border-semantic-bg-line items-center justify-center gap-x-2"
      href={redirectURL}
    >
      <Icons.Lightning01 className="w-[14px] h-[14px] stroke-semantic-fg-primary" />
      <span className="text-semantic-fg-primary product-button-button-2">
        Upgrade Now
      </span>
    </a>
  ) : null;
};
