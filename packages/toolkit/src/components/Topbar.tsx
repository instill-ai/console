import cn from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { env } from "../lib";

export type TopbarProps = {
  logo: ReactElement;
  children?: React.ReactNode;
  className?: string;
};

export const Topbar = (props: TopbarProps) => {
  const { children, className, logo } = props;
  const router = useRouter();
  const { entity } = router.query;

  return (
    <div
      className={cn(
        "flex h-[var(--topbar-height)] box-content flex-row border-b border-semantic-bg-line bg-semantic-bg-primary px-4",
        className
      )}
    >
      <Link
        href={
          entity ? `/${entity}/pipelines` : env("NEXT_PUBLIC_CONSOLE_BASE_URL")
        }
        className="my-auto pr-8"
      >
        {logo}
      </Link>
      <div className="flex flex-1 flex-row">{children}</div>
    </div>
  );
};
