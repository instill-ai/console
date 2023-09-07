import cn from "clsx";
import Link from "next/link";
import { ReactElement } from "react";

export type TopbarProps = {
  logo: ReactElement;
  children?: React.ReactNode;
  className?: string;
};

export const Topbar = (props: TopbarProps) => {
  const { children, className, logo } = props;
  return (
    <div
      className={cn(
        "flex h-[var(--topbar-height)] flex-row bg-semantic-bg-secondary-alt-primary px-4",
        className
      )}
    >
      <Link href="/pipelines" className="my-auto pr-8">
        {logo}
      </Link>
      <div className="flex flex-1 flex-row">{children}</div>
    </div>
  );
};
