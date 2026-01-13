import { Nullable } from "instill-sdk";

import { Icons } from "@instill-ai/design-system";

import {
  InstillStore,
  useAuthenticatedUserSubscription,
  useInstillStore,
  useRouteInfo,
  useShallow,
} from "../../../lib";
import { env } from "../../../server";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const SubscribeCTA = () => {
  const routeInfo = useRouteInfo();

  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const userSub = useAuthenticatedUserSubscription({
    accessToken,
    enabled:
      enabledQuery &&
      routeInfo.data.namespaceType === "NAMESPACE_USER" &&
      env("NEXT_PUBLIC_APP_ENV") === "CLOUD",
  });

  // NOTE: Organization subscriptions are EE-only. In CE, users only.
  let redirectURL: Nullable<string> = null;

  if (
    routeInfo.data.namespaceType === "NAMESPACE_USER" &&
    (userSub.data?.plan === "PLAN_FREE" ||
      userSub.data?.plan === "PLAN_UNSPECIFIED")
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
