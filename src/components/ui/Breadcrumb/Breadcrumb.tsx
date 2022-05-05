import { FC } from "react";

export type BreadcrumbProps = {
  breadcrumbs: string[];
};

const Breadcrumb: FC<BreadcrumbProps> = ({ breadcrumbs }) => {
  return (
    <div className="flex flex-row">
      {breadcrumbs.map((e, index) => {
        if (index === breadcrumbs.length - 1) {
          return (
            <span key={e} className="instill-text-body text-instillBlue50">
              &nbsp;{`${e}`}
            </span>
          );
        }
        return (
          <span key={e} className="instill-text-body text-instillGrey70">
            {`${e}`}&nbsp;/
          </span>
        );
      })}
    </div>
  );
};

export default Breadcrumb;
