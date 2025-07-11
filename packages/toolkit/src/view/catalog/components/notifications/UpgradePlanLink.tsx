import Link from "next/link";
import { Nullable } from "instill-sdk";

import { env } from "../../../../server";

type UpgradePlanLinkProps = {
  plan: string;
  namespaceType: Nullable<"user" | "organization">;
  selectedNamespace: Nullable<string>;
};

export const UpgradePlanLink = ({
  plan,
  namespaceType,
  selectedNamespace,
}: UpgradePlanLinkProps) => {
  const getLinkContent = () => {
    if (plan === "PLAN_FREE" && namespaceType === "user") {
      return {
        text: "Upgrade your plan to create more storage space",
        href: "/subscribe",
      };
    } else if (plan === "PLAN_FREE" && namespaceType === "organization") {
      return {
        text: "Upgrade your plan to create more storage space",
        href: `/${selectedNamespace}/organization-settings/billing/subscriptions/plan`,
      };
    } else if (plan === "PLAN_STARTER" && namespaceType === "user") {
      return {
        text: "Create an organization to add more storage space",
        href: "/settings/organizations/new",
      };
    } else if (plan === "PLAN_TEAM" && namespaceType === "organization") {
      return {
        text: "Contact us to learn about the enterprise plan and create more storage space",
        href: env("NEXT_PUBLIC_INSTILL_AI_SCHEDULE_MEETING_LINK"),
      };
    }

    return null;
  };

  const linkContent = getLinkContent();

  if (!linkContent) {
    return null;
  }

  return (
    <Link
      href={linkContent.href}
      className="hover:underline text-semantic-accent-default cursor-pointer product-body-text-4-regular"
    >
      {linkContent.text}
    </Link>
  );
};
