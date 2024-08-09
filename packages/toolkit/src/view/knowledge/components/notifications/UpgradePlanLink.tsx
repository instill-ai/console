import Link from 'next/link';
import { useAuthenticatedUserSubscription } from '../../../../lib';

type UpgradePlanLinkProps = {
    enabledQuery: boolean;
    accessToken: string | null;
    pageName: 'catalog' | 'upload';
};

export const UpgradePlanLink = ({ enabledQuery, accessToken, pageName }: UpgradePlanLinkProps) => {
    const subscription = useAuthenticatedUserSubscription({
        enabled: enabledQuery,
        accessToken: accessToken || "",
    });

    const plan = subscription?.data?.plan || "PLAN_FREE";

    const getLinkContent = () => {
        if (plan === "PLAN_FREE") {
            return {
                text: pageName === 'catalog'
                    ? "Upgrade your plan to create more catalogs"
                    : "Upgrade your plan for more storage space",
                href: "https://instill.tech/subscribe"
            };
        } else if (plan === "PLAN_PRO") {
            return {
                text: pageName === 'catalog'
                    ? "Contact us to learn about more catalog options"
                    : "Contact us to learn about more storage options",
                href: "https://cal.com/instill-ai/30min-talk"
            };
        }
        return null;
    };

    const linkContent = getLinkContent();

    if (!linkContent || plan === "PLAN_UNPAID") {
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

