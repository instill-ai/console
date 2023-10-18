import * as React from "react";
import { LogoBase, LogoBaseProps } from "./LogoBase";

export const Anthropic = React.forwardRef<
  SVGSVGElement,
  Omit<LogoBaseProps, "viewBox" | "children">
>((props, ref) => {
  const { className, ...passThrough } = props;
  return (
    <LogoBase
      {...passThrough}
      ref={ref}
      viewBox="0 0 60 60"
      className={className}
    >
      <path
        d="M34.9344 10L50.8819 50H59.6273L43.6798 10H34.9344Z"
        fill="#181818"
      />
      <path
        d="M16.4332 34.1714L21.8899 20.1143L27.3466 34.1714H16.4332ZM17.3178 10L1.3728 50H10.2883L13.5493 41.6H30.231L33.4915 50H42.407L26.4619 10H17.3178Z"
        fill="#181818"
      />
    </LogoBase>
  );
});
Anthropic.displayName = "Anthropic";
