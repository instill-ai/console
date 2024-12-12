import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn, Icons, Logo } from "@instill-ai/design-system";

import {
  InstillStore,
  useAuthenticatedUser,
  useGuardPipelineBuilderUnsavedChangesNavigation,
  useInstillStore,
  useShallow,
} from "../../lib";
import { env } from "../../server";
import { CETopbarDropdown } from "./CETopbarDropdown";
import { CloudTopbarDropdown } from "./CloudTopbarDropdown";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

const getMenuItems = ({
  userId,
}: {
  userId?: string;
}): {
  title: string;
  href: string;
  iconName: keyof typeof Icons;
  external?: boolean;
}[] => [
  {
    title: "Chat",
    href: `/${userId}/chat`,
    iconName: "ChatCircle",
  },
  {
    title: "Build",
    href: `/${userId}/pipelines`,
    iconName: "Browser",
  },
  {
    title: "Community",
    href: "https://discord.com/invite/sevxWsqpGh",
    iconName: "MessageSmileSquare",
    external: true,
  },
];

export const TopNavbar = () => {
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));
  const me = useAuthenticatedUser({
    enabled: enabledQuery,
    accessToken,
  });

  const isCloud = env("NEXT_PUBLIC_APP_ENV") === "CLOUD";
  const navigate = useGuardPipelineBuilderUnsavedChangesNavigation();
  const currentPathname = usePathname();
  const isChatPath = currentPathname.split("/")[2] === "chat";

  return (
    <div className="flex flex-row items-center h-14 px-8">
      <button
        onClick={() => {
          if (env("NEXT_PUBLIC_APP_ENV") === "CLOUD") {
            navigate("/hub");
          } else {
            navigate(`/${me.data?.id}/pipelines`);
          }
        }}
        className="mr-auto"
      >
        <Logo variant="colourLogomark" width={32} />
      </button>
      <div className="flex flex-row items-center gap-x-2">
        {getMenuItems({ userId: me.data?.id }).map((item) => {
          const Icon = Icons[item.iconName];
          const isChatLink = item.href.split("/")[2] === "chat";
          const isExternalLink = item.href.includes("http");
          let isActive = false;

          if (isChatLink) {
            if (isChatPath) {
              isActive = true;
            }
          } else {
            if (!isExternalLink && !isChatPath) {
              isActive = true;
            }
          }

          return (
            <Link
              key={item.title}
              href={item.href}
              {...(item.external
                ? { rel: "noopener noreferrer", target: "_blank" }
                : null)}
              className={cn(
                "flex flex-row items-center gap-x-2 h-10 px-4",
                isActive
                  ? "rounded bg-semantic-bg-secondary pointer-events-none"
                  : "",
              )}
            >
              <Icon className="w-4 h-4 stroke-semantic-fg-secondary" />
              <span className="text-semantic-fg-secondary font-semibold">
                {item.title}
              </span>
            </Link>
          );
        })}
        {isCloud ? <CloudTopbarDropdown /> : <CETopbarDropdown />}
      </div>
    </div>
  );
};
