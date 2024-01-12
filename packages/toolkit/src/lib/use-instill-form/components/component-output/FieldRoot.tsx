import cn from "clsx";
import * as React from "react";
import { Nullable } from "../../../type";
import { EnabledReferenceHintOptions } from "../../type";

export const FieldRoot = ({
  fieldKey,
  title,
  children,
  className,
  enabledReferenceHint,
  componentID,
  path,
  instillFormat,
}: {
  fieldKey: string;
  title: Nullable<string>;
  children: React.ReactNode;
  className?: string;
  path: string;
  instillFormat?: string;
} & EnabledReferenceHintOptions) => {
  return (
    <div
      key={fieldKey}
      className={cn(
        "flex w-full flex-col gap-y-2 rounded-[6px] bg-semantic-bg-primary p-2",
        className
      )}
    >
      <div className="flex w-full flex-row flex-wrap gap-2">
        <p className="text-semantic-fg-primary product-body-text-4-semibold">
          {title}
        </p>
        {enabledReferenceHint ? (
          <React.Fragment>
            <p className="rounded border border-semantic-fg-disabled px-2 font-sans text-[10px] leading-[14px] text-semantic-fg-disabled">{`${componentID}.output.${path}`}</p>
            {instillFormat ? (
              <p className="rounded border border-semantic-accent-default px-2 font-sans text-[10px] leading-[14px] text-semantic-accent-default">
                {instillFormat}
              </p>
            ) : null}
          </React.Fragment>
        ) : null}
      </div>
      {children}
    </div>
  );
};
