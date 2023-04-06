import { ReactNode } from "react";

export type PageContentContainerProps = {
  children?: ReactNode;
};

export const PageContentContainer = ({
  children,
}: PageContentContainerProps) => {
  return (
    <div className="flex min-h-full min-w-[927px] flex-col px-[138px] pb-[100px] pt-10">
      {children}
    </div>
  );
};
