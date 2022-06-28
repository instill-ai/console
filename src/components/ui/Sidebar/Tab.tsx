import Link from "next/link";
import { FC, ReactElement } from "react";
import cn from "clsx";

interface TabProps {
  icon: ReactElement;
  tabName: string;
  link: string;
  isCollapsed: boolean;
}

const Tab: FC<TabProps> = ({ icon, tabName, link, isCollapsed }) => {
  return (
    <Link href={link}>
      <a
        className={cn(
          "group flex flex-row py-[15px] px-8 hover:bg-instillBlue50",
          {
            "gap-x-5": !isCollapsed,
          }
        )}
      >
        {icon}
        {isCollapsed ? null : (
          <p className="my-auto text-base leading-[28px] text-instillGrey30 group-hover:text-instillBlue10">
            {tabName}
          </p>
        )}
      </a>
    </Link>
  );
};

export default Tab;
