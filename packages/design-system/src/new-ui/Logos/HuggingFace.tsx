"use client";

import * as React from "react";

import { LogoBase, LogoBaseProps } from "./LogoBase";

export const HuggingFace = React.forwardRef<
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
        d="M29.7224 47.9018C40.1623 47.9018 48.6255 39.3955 48.6255 28.9024C48.6255 18.4094 40.1623 9.90311 29.7224 9.90311C19.2826 9.90311 10.8194 18.4094 10.8194 28.9024C10.8194 39.3955 19.2826 47.9018 29.7224 47.9018Z"
        fill="#FFD21E"
      />
      <path
        d="M48.6255 28.9025C48.6255 18.4094 40.1622 9.90316 29.7224 9.90316C19.2826 9.90316 10.8194 18.4094 10.8194 28.9025C10.8194 39.3955 19.2826 47.9018 29.7224 47.9018C40.1622 47.9018 48.6255 39.3955 48.6255 28.9025ZM8.64348 28.9025C8.64348 17.2016 18.0808 7.71619 29.7224 7.71619C41.364 7.71619 50.8014 17.2016 50.8014 28.9025C50.8014 40.6033 41.364 50.0888 29.7224 50.0888C18.0808 50.0888 8.64348 40.6033 8.64348 28.9025Z"
        fill="#FF9D0B"
      />
      <path
        d="M35.8641 23.731C36.5574 23.977 36.8332 25.4095 37.5335 25.0352C38.8598 24.3264 39.3633 22.6711 38.6581 21.3381C37.9529 20.0051 36.3061 19.499 34.9797 20.2078C33.6534 20.9166 33.1499 22.5719 33.8551 23.9049C34.188 24.5341 35.2444 23.5111 35.8641 23.731Z"
        fill="#3A3B45"
      />
      <path
        d="M23.0498 23.731C22.3566 23.977 22.0808 25.4095 21.3805 25.0352C20.0541 24.3264 19.5506 22.6711 20.2559 21.3381C20.9611 20.0051 22.6079 19.499 23.9342 20.2078C25.2606 20.9166 25.7641 22.5719 25.0589 23.9049C24.726 24.5341 23.6695 23.5111 23.0498 23.731Z"
        fill="#3A3B45"
      />
      <path
        d="M29.5864 36.8515C34.9328 36.8515 36.6581 32.0605 36.6581 29.6002C36.6581 28.3215 35.8029 28.724 34.4332 29.4056C33.1674 30.0354 31.4622 30.9036 29.5864 30.9036C25.6809 30.9036 22.5148 27.1399 22.5148 29.6002C22.5148 32.0605 24.24 36.8515 29.5864 36.8515Z"
        fill="#3A3B45"
      />
      <path
        d="M42.5058 26.3054C43.4822 26.3054 44.2737 25.5098 44.2737 24.5285C44.2737 23.5471 43.4822 22.7516 42.5058 22.7516C41.5293 22.7516 40.7379 23.5471 40.7379 24.5285C40.7379 25.5098 41.5293 26.3054 42.5058 26.3054Z"
        fill="#FF9D0B"
      />
      <path
        d="M17.2111 26.3054C18.1875 26.3054 18.979 25.5098 18.979 24.5285C18.979 23.5471 18.1875 22.7516 17.2111 22.7516C16.2347 22.7516 15.4432 23.5471 15.4432 24.5285C15.4432 25.5098 16.2347 26.3054 17.2111 26.3054Z"
        fill="#FF9D0B"
      />
      <path
        d="M13.573 32.3198C12.6923 32.3198 11.9051 32.6833 11.3563 33.3427C11.0168 33.7511 10.6622 34.4094 10.6333 35.3952C10.264 35.2886 9.90876 35.229 9.57693 35.229C8.73378 35.229 7.97221 35.5537 7.43368 36.1437C6.74175 36.9009 6.43441 37.8315 6.56822 38.7626C6.63187 39.206 6.77928 39.6035 6.99959 39.9714C6.53504 40.3492 6.19288 40.8752 6.02751 41.5078C5.89805 42.0037 5.76532 43.0365 6.45834 44.1004C6.41428 44.1699 6.37294 44.242 6.33431 44.3159C5.91763 45.1108 5.89098 46.0091 6.2587 46.8456C6.81627 48.1135 8.20177 49.1124 10.8923 50.1846C12.5661 50.8516 14.0973 51.2781 14.1109 51.2819C16.3238 51.8587 18.3251 52.1518 20.0576 52.1518C23.2421 52.1518 25.5218 51.1715 26.8339 49.2382C28.9456 46.125 28.6437 43.2776 25.9113 40.5329C24.3991 39.0141 23.3938 36.7746 23.1844 36.2831C22.7623 34.8277 21.646 33.2099 19.7906 33.2099H19.79C19.6339 33.2099 19.4761 33.2224 19.3206 33.247C18.5079 33.3755 17.7974 33.8457 17.2899 34.5532C16.7421 33.8687 16.2101 33.3241 15.7287 33.0169C15.0031 32.5543 14.2779 32.3198 13.573 32.3198ZM13.573 34.5067C13.8504 34.5067 14.1893 34.6254 14.563 34.8638C15.7233 35.6035 17.9623 39.4717 18.782 40.9764C19.0567 41.4804 19.5262 41.6937 19.9489 41.6937C20.7877 41.6937 21.4426 40.8555 20.0256 39.7905C17.8948 38.188 18.6422 35.5685 19.6595 35.4072C19.7041 35.4001 19.7481 35.3968 19.7906 35.3968C20.7153 35.3968 21.1233 36.9988 21.1233 36.9988C21.1233 36.9988 22.3189 40.0168 24.373 42.0797C26.427 44.1431 26.5331 45.7992 25.0361 48.0058C24.015 49.5105 22.0606 49.9648 20.0576 49.9648C17.9802 49.9648 15.8506 49.476 14.6571 49.1649C14.5983 49.1496 7.34012 47.0889 8.25943 45.335C8.41392 45.0403 8.6685 44.9222 8.9889 44.9222C10.2836 44.9222 12.6384 46.8588 13.6507 46.8588C13.877 46.8588 14.0364 46.762 14.1017 46.5258C14.5331 44.9703 7.54302 44.3164 8.13214 42.0633C8.23604 41.6647 8.51782 41.5029 8.91383 41.5034C10.6246 41.5034 14.4629 44.5274 15.2674 44.5274C15.3289 44.5274 15.373 44.5094 15.3969 44.4711C15.8 43.8172 15.5791 43.3607 12.738 41.6324C9.89679 39.9036 7.90259 38.8637 9.03677 37.6226C9.16732 37.4794 9.35227 37.416 9.57693 37.416C11.3019 37.4165 15.3773 41.1442 15.3773 41.1442C15.3773 41.1442 16.4772 42.294 17.1425 42.294C17.2954 42.294 17.4254 42.2333 17.5135 42.0835C17.9851 41.2842 13.1329 37.5882 12.8593 36.0633C12.6738 35.03 12.9893 34.5067 13.573 34.5067Z"
        fill="#FF9D0B"
      />
      <path
        d="M25.0361 48.0058C26.5331 45.7991 26.427 44.143 24.373 42.0796C22.3189 40.0168 21.1233 36.9987 21.1233 36.9987C21.1233 36.9987 20.6767 35.2459 19.6595 35.4072C18.6422 35.5684 17.8954 38.1879 20.0261 39.7904C22.1568 41.3924 19.6018 42.4809 18.782 40.9763C17.9623 39.4717 15.7238 35.6034 14.563 34.8637C13.4027 34.124 12.5856 34.5384 12.8593 36.0633C13.1329 37.5881 17.9857 41.2841 17.5135 42.084C17.0413 42.8833 15.3773 41.1441 15.3773 41.1441C15.3773 41.1441 10.1704 36.3815 9.03674 37.6226C7.9031 38.8637 9.89679 39.9036 12.738 41.6324C15.5797 43.3606 15.8 43.8172 15.3969 44.4711C14.9933 45.125 8.72123 39.8101 8.13211 42.0632C7.54353 44.3163 14.5331 44.9702 14.1017 46.5257C13.6703 48.0818 9.17817 43.5815 8.2594 45.3349C7.34009 47.0889 14.5983 49.1496 14.6571 49.1649C17.0016 49.7761 22.9559 51.0714 25.0361 48.0058Z"
        fill="#FFD21E"
      />
      <path
        d="M46.1438 32.3198C47.0245 32.3198 47.8116 32.6833 48.3605 33.3427C48.6999 33.7511 49.0546 34.4094 49.0834 35.3952C49.4528 35.2886 49.808 35.229 50.1398 35.229C50.983 35.229 51.7445 35.5537 52.2831 36.1437C52.975 36.9009 53.2823 37.8315 53.1485 38.7626C53.0849 39.206 52.9375 39.6035 52.7172 39.9714C53.1817 40.3492 53.5239 40.8752 53.6892 41.5078C53.8187 42.0037 53.9514 43.0365 53.2584 44.1004C53.3025 44.1699 53.3438 44.242 53.3824 44.3159C53.7991 45.1108 53.8258 46.0091 53.458 46.8456C52.9005 48.1135 51.515 49.1124 48.8245 50.1846C47.1507 50.8516 45.6194 51.2781 45.6058 51.2819C43.3929 51.8587 41.3917 52.1518 39.6591 52.1518C36.4747 52.1518 34.1949 51.1715 32.8828 49.2382C30.7711 46.125 31.073 43.2776 33.8054 40.5329C35.3177 39.0141 36.3229 36.7746 36.5324 36.2831C36.9545 34.8277 38.0707 33.2099 39.9262 33.2099H39.9267C40.0829 33.2099 40.2406 33.2224 40.3962 33.247C41.2089 33.3755 41.9193 33.8457 42.4268 34.5532C42.9746 33.8687 43.5066 33.3241 43.988 33.0169C44.7137 32.5543 45.4388 32.3198 46.1438 32.3198ZM46.1438 34.5067C45.8664 34.5067 45.5275 34.6254 45.1538 34.8638C43.9935 35.6035 41.7545 39.4717 40.9347 40.9764C40.66 41.4804 40.1906 41.6937 39.7679 41.6937C38.9291 41.6937 38.2742 40.8555 39.6912 39.7905C41.8219 38.188 41.0745 35.5685 40.0573 35.4072C40.0127 35.4001 39.9686 35.3968 39.9262 35.3968C39.0014 35.3968 38.5935 36.9988 38.5935 36.9988C38.5935 36.9988 37.3978 40.0168 35.3438 42.0797C33.2897 44.1431 33.1837 45.7992 34.6807 48.0058C35.7017 49.5105 37.6562 49.9648 39.6591 49.9648C41.7365 49.9648 43.8662 49.476 45.0597 49.1649C45.1184 49.1496 52.3766 47.0889 51.4573 45.335C51.3028 45.0403 51.0483 44.9222 50.7278 44.9222C49.4332 44.9222 47.0783 46.8588 46.066 46.8588C45.8397 46.8588 45.6803 46.762 45.6151 46.5258C45.1837 44.9703 52.1737 44.3164 51.5846 42.0633C51.4807 41.6647 51.1989 41.5029 50.8029 41.5034C49.0921 41.5034 45.2539 44.5274 44.4493 44.5274C44.3879 44.5274 44.3438 44.5094 44.3199 44.4711C43.9168 43.8172 44.1376 43.3607 46.9788 41.6324C49.82 39.9036 51.8142 38.8637 50.68 37.6226C50.5494 37.4794 50.3645 37.416 50.1398 37.416C48.4149 37.4165 44.3394 41.1442 44.3394 41.1442C44.3394 41.1442 43.2395 42.294 42.5743 42.294C42.4214 42.294 42.2914 42.2333 42.2033 42.0835C41.7316 41.2842 46.5839 37.5882 46.8575 36.0633C47.043 35.03 46.7275 34.5067 46.1438 34.5067Z"
        fill="#FF9D0B"
      />
      <path
        d="M34.6809 48.0058C33.1839 45.7991 33.29 44.143 35.344 42.0796C37.3981 40.0168 38.5937 36.9987 38.5937 36.9987C38.5937 36.9987 39.0403 35.2459 40.0576 35.4072C41.0748 35.5684 41.8217 38.1879 39.6909 39.7904C37.5602 41.3924 40.1152 42.4809 40.935 40.9763C41.7548 39.4717 43.9932 35.6034 45.154 34.8637C46.3143 34.124 47.1314 34.5384 46.8578 36.0633C46.5841 37.5881 41.7314 41.2841 42.2035 42.084C42.6757 42.8833 44.3397 41.1441 44.3397 41.1441C44.3397 41.1441 49.5466 36.3815 50.6803 37.6226C51.8139 38.8637 49.8202 39.9036 46.9791 41.6324C44.1374 43.3606 43.917 43.8172 44.3201 44.4711C44.7238 45.125 50.9958 39.8101 51.5849 42.0632C52.1735 44.3163 45.184 44.9702 45.6153 46.5257C46.0467 48.0818 50.5388 43.5815 51.4576 45.3349C52.3769 47.0889 45.1187 49.1496 45.0599 49.1649C42.7154 49.7761 36.7611 51.0714 34.6809 48.0058Z"
        fill="#FFD21E"
      />
      <mask
        id="mask0_21_291"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="22"
        y="28"
        width="15"
        height="9"
      >
        <path
          d="M29.5864 36.8515C34.9328 36.8515 36.6581 32.0605 36.6581 29.6002C36.6581 28.3215 35.8029 28.724 34.4332 29.4056C33.1674 30.0354 31.4622 30.9036 29.5864 30.9036C25.6809 30.9036 22.5148 27.1399 22.5148 29.6002C22.5148 32.0605 24.24 36.8515 29.5864 36.8515Z"
          fill="white"
        />
      </mask>
      <g mask="url(#mask0_21_291)">
        <path
          d="M29.7224 42.4345C32.328 42.4345 34.4402 40.3115 34.4402 37.6926C34.4402 35.6528 33.1588 33.9138 31.3609 33.2445C31.2947 33.2199 31.2279 33.1967 31.1604 33.175C30.707 33.0293 30.2239 34.5954 29.7224 34.5954C29.2539 34.5954 28.8013 33.0194 28.3741 33.1472C26.4255 33.7303 25.0045 35.5446 25.0045 37.6926C25.0045 40.3115 27.1168 42.4345 29.7224 42.4345Z"
          fill="#F94040"
        />
      </g>
    </LogoBase>
  );
});
HuggingFace.displayName = "HuggingFace";
