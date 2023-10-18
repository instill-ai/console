import * as React from "react";
import { CollapseLeftIcon, CollapseRightIcon } from "../../Icons";
import ButtonBase, { ButtonBaseProps } from "../ButtonBase";

export type CollapseSidebarButtonRequiredKeys = "onClickHandler" | "isCollapse";

export type CollapseSidebarButtonOmitKeys =
  | "bgColor"
  | "bgOpacity"
  | "textColor"
  | "disabledBgColor"
  | "disabledBgOpacity"
  | "disabledTextColor"
  | "disabledBorderColor"
  | "padding"
  | "width"
  | "borderSize"
  | "borderColor"
  | "hoveredBgColor"
  | "hoveredBgOpacity"
  | "hoveredTextColor"
  | "hoveredBorderColor"
  | "borderRadius"
  | "startIcon"
  | "endIcon"
  | "itemGapX"
  | "type"
  | "textSize"
  | "shadow"
  | "hoveredShadow";

export type CollapseSidebarButtonConfig = Pick<
  ButtonBaseProps,
  CollapseSidebarButtonOmitKeys
>;

export type FullCollapseSidebarButtonProps = Omit<
  ButtonBaseProps,
  CollapseSidebarButtonOmitKeys
> & { isCollapse: boolean };

export type CollapseSidebarButtonRequiredProps = Pick<
  FullCollapseSidebarButtonProps,
  CollapseSidebarButtonRequiredKeys
>;

export type CollapseSidebarButtonOptionalProps = Partial<
  Omit<FullCollapseSidebarButtonProps, CollapseSidebarButtonRequiredKeys>
>;

export type CollapseSidebarButtonProps = CollapseSidebarButtonRequiredProps &
  CollapseSidebarButtonOptionalProps;

const CollapseSidebarButton = (props: CollapseSidebarButtonProps) => {
  const { onClickHandler, disabled, position, dataFlag, isCollapse } = props;

  const collapseSidebarButtonConfig: CollapseSidebarButtonConfig = {
    type: "button",
    width: null,
    borderSize: null,
    borderColor: null,
    disabledBorderColor: null,
    hoveredBorderColor: null,
    startIcon: null,
    endIcon: null,
    itemGapX: null,
    bgColor: "bg-instillGrey90",
    borderRadius: null,
    hoveredBgColor: "hover:bg-instillGrey80",
    textColor: null,
    hoveredTextColor: null,
    disabledBgColor: "bg-instillGrey90",
    disabledTextColor: null,
    padding: "p-[3px]",
    textSize: null,
    disabledBgOpacity: null,
    hoveredBgOpacity: null,
    bgOpacity: null,
    shadow: null,
    hoveredShadow: null,
  };

  return (
    <ButtonBase
      onClickHandler={onClickHandler}
      disabled={disabled ?? false}
      position={position ?? null}
      dataFlag={dataFlag ?? null}
      {...collapseSidebarButtonConfig}
    >
      {isCollapse ? (
        <CollapseRightIcon
          width="w-[14px]"
          height="h-[14px]"
          position="m-auto"
          color="fill-instillGrey05 group-hover:fill-instillBlue50"
        />
      ) : (
        <CollapseLeftIcon
          width="w-[14px]"
          height="h-[14px]"
          position="m-auto"
          color="fill-instillGrey05 group-hover:fill-instillBlue50"
        />
      )}
    </ButtonBase>
  );
};

export default CollapseSidebarButton;
