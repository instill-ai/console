import cn from "clsx";
import { BreadcrumbProps, Breadcrumb } from "./Breadcrumb";

export type PageTitleProps = {
  title: string;
  breadcrumbs: BreadcrumbProps["breadcrumbs"];
  className?: string;
};

export const PageTitle = ({
  title,
  breadcrumbs,
  className,
}: PageTitleProps) => {
  return (
    <div className={cn("flex w-full flex-col", className)}>
      <Breadcrumb breadcrumbs={breadcrumbs} />
      <div className="flex min-h-[44px] w-full flex-row">
        <h2 className="mr-auto mt-auto text-black text-instill-h2">{title}</h2>
      </div>
    </div>
  );
};
