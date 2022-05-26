import { FC } from "react";

const PageContentContainer: FC = ({ children }) => {
  return (
    <div className="flex min-h-full min-w-[927px] flex-col px-[138px] pt-10 pb-[100px]">
      {children}
    </div>
  );
};

export default PageContentContainer;
