import Link from "next/link";
import { FC, ReactElement } from "react";

interface TabProps {
  icon: ReactElement;
  tabName: string;
  link: string;
}

const Tab: FC<TabProps> = ({ icon, tabName, link }) => {
  return (
    <Link href={link}>
      <a className="flex flex-row gap-x-5 py-[15px] px-6">
        {icon}
        <p className="text-base leading-[28px] text-instillGrey30">{tabName}</p>
      </a>
    </Link>
  );
};

export default Tab;
