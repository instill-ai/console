import { FC } from "react";

export type BreadcrumProps = {
  breadcurms: string[];
};

const Breadcrum: FC<BreadcrumProps> = ({ breadcurms }) => {
  return (
    <div className="flex flex-row">
      {breadcurms.map((e, index) => {
        if (index === breadcurms.length - 1) {
          return (
            <span
              key={e}
              className="instill-text-body text-instillBlue50"
            >{`${e}`}</span>
          );
        }
        return (
          <span
            key={e}
            className="instill-text-body text-instillGrey70"
          >{`${e}/`}</span>
        );
      })}
    </div>
  );
};

export default Breadcrum;
