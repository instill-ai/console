import cn from "clsx";
import Link from "next/link";
import { ReactElement } from "react";

export type ProfileSidebarLinkProps = {
  href: string;
  className?: string;
  icon?: ReactElement;
  name?: string;
  hightlighted?: boolean;
};

export const ProfileSidebarLink = (props: ProfileSidebarLinkProps) => {
  const { href, className, icon, name, hightlighted } = props;
  return (
    <Link
      href={href}
      className={cn(
        "flex min-w-[150px] flex-row items-center rounded-xs border border-transparent py-2 hover:bg-semantic-accent-bg",
        {
          "!border-opacity-100 !bg-semantic-accent-bg": hightlighted,
        },
        className
      )}
    >
      <div className="flex flex-row items-center space-x-3">
        {icon}
        <h4
          className={cn(
            "text-semantic-fg-primary product-body-text-2-semibold",
            { "!text-semantic-accent-default": hightlighted }
          )}
        >
          {name}
        </h4>
      </div>
    </Link>
  );
};
