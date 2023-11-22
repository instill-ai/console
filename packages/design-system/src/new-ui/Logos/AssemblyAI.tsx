import * as React from "react";
import { LogoBase, LogoBaseProps } from "./LogoBase";

export const AssemblyAI = React.forwardRef<
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
      <mask
        id="mask0_463_107"
        style={{ maskType: "luminance" }}
        maskUnits="userSpaceOnUse"
        x="10"
        y="10"
        width="40"
        height="40"
      >
        <path d="M50 10H10V50H50V10Z" fill="white" />
      </mask>
      <g mask="url(#mask0_463_107)">
        <path
          d="M13.7793 36.7509L10.6141 44.1914C9.72597 46.2743 9.55896 48.6499 11.783 49.4773C12.3143 49.6771 12.8533 49.7699 13.3922 49.7699C15.1077 49.7699 16.7396 48.7997 17.4152 47.2089L18.0528 45.7107L22.9336 34.247L27.7915 22.8261C28.9509 20.796 29.6619 17.672 34.2132 15.9921C30.6748 15.5383 23.5422 14.6046 23.4709 14.6046C23.4252 14.6759 22.9487 15.4 22.9032 15.4713C22.8045 15.6283 22.7058 15.7924 22.6299 15.9636C22.6223 15.9778 22.6223 15.985 22.6148 15.9921L13.7869 36.7367C13.7869 36.7367 13.7793 36.7439 13.7793 36.7509Z"
          fill="url(#paint0_radial_463_107)"
        />
        <path
          d="M45.4234 36.7507L48.5886 44.191C49.4767 46.2741 49.6437 48.6496 47.4197 49.4771C46.8883 49.6768 46.3494 49.7696 45.8105 49.7696C44.095 49.7696 42.4631 48.7994 41.7875 47.2086L41.1499 45.7105L36.2692 34.2468L31.4113 22.8258C30.2519 20.7957 28.2947 16.5993 23.0677 15.2428C23.728 13.6948 25.9915 13.4309 27.7601 13.4309H32.5574H32.5953C32.7851 13.438 32.9673 13.4594 33.1646 13.4879C33.2633 13.5022 33.3696 13.5022 33.4683 13.5236C33.5973 13.5521 33.7188 13.6021 33.8479 13.6377C33.9921 13.6805 34.1363 13.7091 34.2729 13.7661C34.3336 13.7947 34.3943 13.8303 34.4551 13.8589C34.6448 13.9445 34.827 14.0301 35.0015 14.1371C35.1231 14.2084 35.2216 14.3083 35.3356 14.3939C35.4342 14.4724 35.5481 14.5437 35.6392 14.6293C35.7227 14.7149 35.7986 14.8148 35.8821 14.9075C35.9808 15.0217 36.087 15.1215 36.1705 15.2428C36.216 15.3141 36.2541 15.3997 36.2996 15.4711C36.3983 15.628 36.4969 15.7921 36.5729 15.9633C36.5804 15.9776 36.5804 15.9847 36.588 15.9918L45.4159 36.7364C45.4159 36.7364 45.4234 36.7435 45.4234 36.7507Z"
          fill="url(#paint1_radial_463_107)"
        />
      </g>
      <defs>
        <radialGradient
          id="paint0_radial_463_107"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(25.0283 18.5006) rotate(112.412) scale(34.2732 23.395)"
        >
          <stop stopColor="#142167" />
          <stop offset="1" stopColor="#263DB5" />
        </radialGradient>
        <radialGradient
          id="paint1_radial_463_107"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(46.6637 21.4142) rotate(132.41) scale(31.8128 111.308)"
        >
          <stop stopColor="#4259D4" />
          <stop offset="1" stopColor="#6A81FC" />
        </radialGradient>
      </defs>
    </LogoBase>
  );
});
AssemblyAI.displayName = "AssemblyAI";
