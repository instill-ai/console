import * as React from "react";
import {
  ComplicateIconBase,
  ComplicateIconBaseProps,
} from "./ComplicateIconBase";

export const ImageClassification = React.forwardRef<
  SVGSVGElement,
  Omit<ComplicateIconBaseProps, "viewBox" | "children"> & {
    fillAreaColor: string;
  }
>((props, ref) => {
  const { className, fillAreaColor, ...passThrough } = props;
  return (
    <ComplicateIconBase
      {...passThrough}
      ref={ref}
      viewBox="0 0 30 30"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.0001 8.33527C11.8788 8.33527 9.07408 9.98085 7.06738 11.598C6.06069 12.4092 5.24661 13.22 4.68406 13.8279C4.40265 14.1321 4.1838 14.3859 4.03491 14.5641C3.96045 14.6533 3.90346 14.7236 3.86485 14.7719C3.84554 14.7961 3.83083 14.8147 3.82083 14.8275L3.80937 14.8422L3.80631 14.8462L3.8052 14.8476L3.68823 15L3.80546 15.1528L3.80631 15.1539L3.80937 15.1578L3.82083 15.1725C3.83083 15.1853 3.84554 15.204 3.86485 15.2281C3.90346 15.2765 3.96045 15.3468 4.03491 15.4359C4.1838 15.6142 4.40265 15.868 4.68406 16.1721C5.24661 16.7801 6.06069 17.5908 7.06738 18.4021C9.07408 20.0192 11.8788 21.6648 15.0001 21.6648C18.1215 21.6648 20.9261 20.0192 22.9329 18.4021C23.9395 17.5908 24.7536 16.7801 25.3162 16.1721C25.5976 15.868 25.8164 15.6142 25.9653 15.4359C26.0398 15.3468 26.0968 15.2765 26.1354 15.2281C26.1547 15.204 26.1694 15.1853 26.1794 15.1725L26.1909 15.1578L26.1939 15.1539L26.195 15.1524L26.312 15L26.1948 14.8473L26.1939 14.8462L26.1909 14.8422L26.1794 14.8275C26.1694 14.8147 26.1547 14.7961 26.1354 14.7719C26.0968 14.7236 26.0398 14.6533 25.9653 14.5641C25.8164 14.3859 25.5976 14.1321 25.3162 13.8279C24.7536 13.22 23.9395 12.4092 22.9329 11.598C20.9261 9.98085 18.1215 8.33527 15.0001 8.33527ZM25.9969 15C26.1952 15.1522 26.1951 15.1523 26.195 15.1524L25.9969 15ZM26.1948 14.8473C26.1949 14.8474 26.1952 14.8478 25.9969 15L26.1948 14.8473ZM4.00338 15C3.80506 14.8478 3.80512 14.8477 3.8052 14.8476L4.00338 15ZM3.80546 15.1528C3.80538 15.1527 3.80506 15.1522 4.00338 15L3.80546 15.1528ZM8.04422 12.8102C8.90858 12.1136 9.88987 11.446 10.9478 10.9256C9.9005 11.9667 9.25195 13.4087 9.25195 15.0024C9.25195 16.5913 9.89659 18.0294 10.9383 19.0698C9.88398 18.55 8.90597 17.8844 8.04422 17.1899C7.11024 16.4372 6.3514 15.6818 5.82672 15.1148C5.79042 15.0756 5.75528 15.0373 5.72132 15C5.75528 14.9628 5.79042 14.9245 5.82672 14.8852C6.3514 14.3182 7.11024 13.5628 8.04422 12.8102ZM20.7487 15.0024C20.7487 13.4089 20.1003 11.967 19.0532 10.926C20.1109 11.4464 21.0919 12.1138 21.956 12.8102C22.89 13.5628 23.6488 14.3182 24.1735 14.8852C24.2098 14.9245 24.2449 14.9627 24.2789 15C24.2449 15.0373 24.2098 15.0756 24.1735 15.1148C23.6488 15.6818 22.89 16.4372 21.956 17.1899C21.0945 17.8842 20.1167 18.5497 19.0627 19.0694C20.1042 18.0291 20.7487 16.5911 20.7487 15.0024ZM10.8087 15.0024C10.8087 12.6875 12.6854 10.8108 15.0003 10.8108C17.3153 10.8108 19.1919 12.6875 19.1919 15.0024C19.1919 17.3174 17.3153 19.194 15.0003 19.194C12.6854 19.194 10.8087 17.3174 10.8087 15.0024Z"
        className={fillAreaColor}
      />
    </ComplicateIconBase>
  );
});
ImageClassification.displayName = "ImageClassificationIcon";
