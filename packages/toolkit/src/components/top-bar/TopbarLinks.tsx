import { Icons } from "@instill-ai/design-system";
import cn from "clsx";
import Link from "next/link";
import * as React from "react";
import { env } from "../../server";

export const topbarItems = [
  {
    pathName: "pipelines",
    icon: <Icons.Pipeline className="w-6 h-6 stroke-semantic-fg-primary" />,
    name: "Pipelines",
  },
  // {
  //   pathName: "knowledge",
  //   icon: <Icons.GraduationHat className="w-6 h-6 stroke-semantic-fg-primary" />,
  //   name: "Knowledge base",
  // },
  {
    pathName: "models",
    icon: <Icons.Cube01 className="w-6 h-6 stroke-semantic-fg-primary" />,
    name: "Models",
  },
  {
    pathName: "dashboard",
    icon: (
      <Icons.BarChartSquare02 className="w-6 h-6 stroke-semantic-fg-primary" />
    ),
    name: "Dashboard",
  },
];

export const TopbarLinks = ({
  pathname,
  entity,
}: {
  pathname: string;
  entity: string;
}) => {
  return (
    <React.Fragment>
      {env("NEXT_PUBLIC_APP_ENV") === "CLOUD" ? (
        <TopbarLink
          key="hub"
          href="/hub"
          icon={
            <Icons.CubeOutline className="w-6 h-6 stroke-semantic-fg-primary" />
          }
          name="Hub"
          hightlighted={pathname.split("/")[1] === "hub"}
          className="px-4 mx-1 my-2"
        />
      ) : null}
      {topbarItems.map(({ pathName, name, icon }) => (
        <TopbarLink
          key={pathName}
          href={`/${entity}/${pathName}`}
          icon={icon}
          name={name}
          hightlighted={pathname.split("/")[2] === pathName}
          className="px-4 mx-1 my-2"
        />
      ))}
    </React.Fragment>
  );
};

export const TopbarLink = (props: {
  href: string;
  className?: string;
  icon: React.ReactElement;
  name: string;
  hightlighted: boolean;
}) => {
  const { href, className, icon, name, hightlighted } = props;
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-row items-center rounded-xs border border-transparent py-2 hover:bg-semantic-bg-base-bg",
        {
          "border-opacity-100 bg-semantic-accent-bg": hightlighted,
        },
        className
      )}
    >
      <div className="flex flex-row items-center space-x-3">
        {icon}
        <h4 className="text-semantic-fg-primary product-button-button-1">
          {name}
        </h4>
      </div>
    </Link>
  );
};
