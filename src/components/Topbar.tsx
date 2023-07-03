import cn from "clsx";
import { Logo, Icons } from "@instill-ai/design-system";
import Link from "next/link";

export type TopbarProps = {
  children?: React.ReactNode;
};

export const Topbar = (props: TopbarProps) => {
  const { children } = props;
  return (
    <div className="flex h-[var(--topbar-height)] flex-row bg-semantic-bg-secondary-alt-primary px-4">
      <Link
        href="/pipelines"
        className={cn(
          "my-auto pr-8",
          children ? " border-r border-semantic-bg-primary" : ""
        )}
      >
        <Logo variant="ColourLogomarkWhiteType" width={180} />
      </Link>
      <div className="flex flex-1 flex-row">{children}</div>
      <div className="flex">
        <Link className="my-auto flex h-[48px] w-[48px]" href="/settings">
          <Icons.Gear01 className="m-auto h-6 w-6 stroke-semantic-fg-primary-on-bg-secondary" />
        </Link>
      </div>
    </div>
  );
};
