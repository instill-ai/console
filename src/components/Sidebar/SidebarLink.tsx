import cn from "clsx";
import Link from "next/link";
import { ReactElement } from "react";

export type SidebarLinkProps = {
  href: string;
  className?: string;
  icon: ReactElement;
  name: string;
  hightlighted: boolean;
};

export const SidebarLink = (props: SidebarLinkProps) => {
  const { href, className, icon, name, hightlighted } = props;
  return (
    <Link
      href={href}
      className={cn(
        "flex min-w-[280px] flex-row items-center rounded-xs border border-transparent py-2 hover:bg-semantic-bg-base-bg",
        {
          "!border-semantic-accent-default border-opacity-100 bg-semantic-accent-bg":
            hightlighted,
        },
        className
      )}
    >
      <div className="flex flex-row items-center space-x-3">
        {icon}
        <h4 className="text-semantic-fg-primary product-body-text-2-semibold">
          {name}
        </h4>
      </div>
    </Link>
  );
};
