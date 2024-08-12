import Link from "next/link";

type UpgradePlanLinkProps = {
  plan: string;
  namespaceType: "user" | "organization" | null;
  pageName: "catalog" | "upload";
};

export const UpgradePlanLink = ({
  plan,
  namespaceType,
  pageName,
}: UpgradePlanLinkProps) => {
  const getLinkContent = () => {
    const baseText = pageName === "catalog" ? "catalogs" : "storage space";

    if (plan === "PLAN_FREE") {
      return {
        text: `Upgrade your plan to create more ${baseText}`,
        href: "/subscribe",
      };
    } else if (plan === "PLAN_PRO" && namespaceType === "user") {
      return {
        text: `Create an organization to add more ${baseText}`,
        href: "/settings/organizations/new",
      };
    } else if (plan === "PLAN_TEAM" && namespaceType === "organization") {
      return {
        text: `Contact us to learn about the enterprise plan and create more ${baseText}`,
        href: "https://cal.com/instill-ai/30min-talk",
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