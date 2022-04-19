import { Sidebar } from "components/ui/commons";
import { FC, ReactNode } from "react";

export interface PageBaseProps {
  children: ReactNode;
}

const PageBase: FC<PageBaseProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-row">
        <Sidebar />
        <div className="flex flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
};

export default PageBase;
