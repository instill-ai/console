import { Sidebar } from "@/components/ui";
import { ReactNode } from "react";

export type PageBaseProps = {
  children: ReactNode;
};

const PageBase = ({ children }: PageBaseProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-row">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col overflow-y-scroll bg-instillGrey05">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageBase;
