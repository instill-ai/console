import { ReactNode } from "react";

export type PageContentContainerProps = {
  children?: ReactNode;
};

const PageContentContainer = ({ children }: PageContentContainerProps) => {
  return (
    <div className="flex min-h-full min-w-[927px] flex-col px-[138px] pt-10 pb-[100px]">
      {children}
    </div>
  );
};

export default PageContentContainer;
