import * as React from "react";
import { IconBase, IconBaseProps } from "./IconBase";

export const MasterCard = React.forwardRef<
  SVGSVGElement,
  Omit<IconBaseProps, "viewBox" | "children">
>((props, ref) => {
  const { className, ...passThrough } = props;
  return (
    <IconBase
      {...passThrough}
      ref={ref}
      viewBox="0 0 30 19"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.9053 16.4392C13.3266 17.77 11.2787 18.5733 9.04092 18.5733C4.04776 18.5733 0 14.5737 0 9.63995C0 4.70621 4.04776 0.706619 9.04092 0.706619C11.2787 0.706619 13.3266 1.50995 14.9053 2.84068C16.484 1.50995 18.5319 0.706619 20.7697 0.706619C25.7628 0.706619 29.8106 4.70621 29.8106 9.63995C29.8106 14.5737 25.7628 18.5733 20.7697 18.5733C18.5319 18.5733 16.484 17.77 14.9053 16.4392Z"
        fill="#ED0006"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.9053 16.4392C16.8492 14.8007 18.0818 12.3626 18.0818 9.63995C18.0818 6.91735 16.8492 4.47921 14.9053 2.84067C16.484 1.50995 18.5319 0.706619 20.7697 0.706619C25.7628 0.706619 29.8106 4.70621 29.8106 9.63995C29.8106 14.5737 25.7628 18.5733 20.7697 18.5733C18.5319 18.5733 16.484 17.77 14.9053 16.4392Z"
        fill="#F9A000"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.9053 16.4392C16.8492 14.8007 18.0818 12.3626 18.0818 9.63996C18.0818 6.91737 16.8492 4.47925 14.9053 2.84071C12.9614 4.47925 11.7288 6.91737 11.7288 9.63996C11.7288 12.3626 12.9614 14.8007 14.9053 16.4392Z"
        fill="#FF5E00"
      />
    </IconBase>
  );
});

MasterCard.displayName = "IconMasterCard";
