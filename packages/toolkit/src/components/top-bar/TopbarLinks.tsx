import * as React from "react";
import Link from "next/link";
import cn from "clsx";

import { Icons } from "@instill-ai/design-system";

import { env } from "../../server";

export const topbarItems = [
  {
    pathName: "pipelines",
    icon: <Icons.Pipeline className="h-6 w-6 stroke-semantic-fg-primary" />,
    name: "Pipelines",
  },
  {
    pathName: "models",
    icon: <Icons.Cube01 className="h-6 w-6 stroke-semantic-fg-primary" />,
    name: "Models",
  },
  {
    pathName: "dashboard",
    icon: (
      <Icons.BarChartSquare02 className="h-6 w-6 stroke-semantic-fg-primary" />
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
            <Icons.CubeOutline className="h-6 w-6 stroke-semantic-fg-primary" />
          }
          name="Hub"
          hightlighted={pathname.split("/")[1] === "hub"}
          className="mx-1 my-2 px-4"
        />
      ) : null}
      {topbarItems.map(({ pathName, name, icon }) => (
        <TopbarLink
          key={pathName}
          href={`/${entity}/${pathName}`}
          icon={icon}
          name={name}
          hightlighted={pathname.split("/")[2] === pathName}
          className="mx-1 my-2 px-4"
        />
      ))}
      <ArtifactDropdown
        entity={entity}
        hightlighted={pathname.split("/")[2] === "knowledge"}
      />
    </React.Fragment>
  );
};

const ArtifactDropdown = ({ entity, hightlighted }: { entity: string; hightlighted: boolean }) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            "flex flex-row items-center rounded-xs border border-transparent py-2 hover:bg-semantic-bg-base-bg mx-1 my-2 px-4",
            {
              "border-opacity-100 bg-semantic-accent-bg": hightlighted,
            }
          )}
        >
          <Icons.GraduationHat className="h-6 w-6 stroke-semantic-fg-primary mr-3" />
          <h4 className="text-semantic-fg-primary product-button-button-1">
            Artifact
          </h4>
          <Icons.ChevronDown className="h-4 w-4 stroke-semantic-fg-primary ml-2" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="start" className="w-[200px] !rounded !px-0 !py-2">
        <DropdownMenu.Item asChild>
          <Link
            href={`/${entity}/knowledge`}
            className="flex items-center gap-x-2 !px-4 !py-2.5 !text-semantic-fg-primary !product-button-button-2"
          >
            Knowledge Base
          </Link>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
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
        className,
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