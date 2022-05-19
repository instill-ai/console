import { FC } from "react";

const PageContentContainer: FC = ({ children }) => {
  return (
    <div className="flex h-full flex-col px-[138px] py-10">{children}</div>
  );
};

export default PageContentContainer;
