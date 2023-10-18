import * as React from "react";
export type ComplicateIconBaseProps = {
  viewBox: string;
  className?: string;
  children: React.ReactNode;
} & Omit<React.SVGProps<SVGSVGElement>, "color" | "height" | "width">;

export const ComplicateIconBase = React.forwardRef<
  SVGSVGElement,
  ComplicateIconBaseProps
>((props: ComplicateIconBaseProps, ref) => {
  const { children, viewBox, className, ...passThrough } = props;
  return (
    <svg
      {...passThrough}
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      className={className}
      fill="none"
    >
      {children}
    </svg>
  );
});
ComplicateIconBase.displayName = "ComplicateIconBase";
