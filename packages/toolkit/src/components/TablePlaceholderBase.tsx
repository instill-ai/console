import cn from "clsx";
import * as React from "react";
import { useRouter } from "next/router";
import { SolidButton } from "@instill-ai/design-system";

export type TablePlaceholderBaseProps = {
  placeholderItems: {
    id: string;
    item: React.ReactElement;
  }[];
  placeholderTitle: string;
  createButtonTitle: string;
  createButtonLink: string;
  enableCreateButton: boolean;

  svgElement?: React.ReactNode;

  /**
   * - Default is undefined
   */
  marginBottom?: string;
};

export const TablePlaceholderBase = ({
  placeholderItems,
  placeholderTitle,
  createButtonTitle,
  createButtonLink,
  marginBottom,
  enableCreateButton,
  svgElement,
}: TablePlaceholderBaseProps) => {
  const router = useRouter();
  const handleOnClick = () => {
    router.push(createButtonLink);
  };
  return (
    <div
      className={cn(
        "flex min-h-[300px] w-full flex-row border border-instillGrey15 bg-white px-[9px] py-[18px]",
        marginBottom
      )}
    >
      {svgElement ? (
        svgElement
      ) : (
        <div className="grid grid-cols-3 grid-rows-2 gap-x-2 gap-y-2 px-[27px] opacity-10">
          {placeholderItems.map((e) => (
            <React.Fragment key={e.id}>{e.item}</React.Fragment>
          ))}
        </div>
      )}

      <div className="m-auto flex flex-col gap-y-5">
        <h3 className="text-instillGrey80 text-instill-h3">
          {placeholderTitle}
        </h3>
        {enableCreateButton ? (
          <SolidButton
            type="button"
            color="primary"
            disabled={false}
            onClickHandler={handleOnClick}
            position={null}
          >
            {createButtonTitle}
          </SolidButton>
        ) : null}
      </div>
    </div>
  );
};
