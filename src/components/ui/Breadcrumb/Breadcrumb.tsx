import { FC } from "react";

export type BreadcrumbProps = {
  breadcrumbs: string[];
};

const Breadcrumb: FC<BreadcrumbProps> = ({ breadcrumbs }) => {
  return (
    <div className="flex flex-row">
      {breadcrumbs.map((e, index) => {
        if (breadcrumbs.length === 1) {
          return (
            <span key={e} className="text-instillGrey70 text-instill-body">
              {`${e}`}
            </span>
          );
        }

        if (index === breadcrumbs.length - 1) {
          return (
            <span key={e} className="text-instillBlue50 text-instill-body">
              &nbsp;{`${e}`}
            </span>
          );
        }
        return (
          <span key={e} className="text-instillGrey70 text-instill-body">
            {`${e}`}&nbsp;/
          </span>
        );
      })}
    </div>
  );
};

export default Breadcrumb;
