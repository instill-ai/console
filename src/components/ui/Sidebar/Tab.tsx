import Link from "next/link";
import { FC, ReactElement } from "react";

interface TabProps {
  icon: ReactElement;
  tabName: string;
  link: string;
  isCollapsed: boolean;
}

const Tab: FC<TabProps> = ({ icon, tabName, link, isCollapsed }) => {
  return (
    <Link href={link}>
      <a className="flex flex-row gap-x-5 py-[15px] px-6">
        {icon}
        {isCollapsed ? null : (
          <p className="text-base leading-[28px] text-instillGrey30">
            {tabName}
          </p>
        )}
      </a>
    </Link>
  );
};

export default Tab;
