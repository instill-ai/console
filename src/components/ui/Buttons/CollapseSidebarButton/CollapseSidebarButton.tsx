import { FC } from "react";
import ButtonBase, { ButtonBaseProps } from "../ButtonBase";
import { CollapseRightIcon, CollapseLeftIcon } from "@instill-ai/design-system";

export type CollapseSidebarButtonProps = Omit<
  ButtonBaseProps,
  | "bgColor"
  | "textColor"
  | "disabledBgColor"
  | "disabledTextColor"
  | "padding"
  | "width"
  | "borderSize"
  | "borderColor"
  | "disabledBorderColor"
  | "hoveredBgColor"
  | "hoveredTextColor"
> & {
  isCollapse: boolean;
};

const CollapseSidebarButton: FC<CollapseSidebarButtonProps> = (props) => {
  return (
    <ButtonBase
      disabled={props.disabled}
      onClickHandler={props.onClickHandler}
      position={props.position}
      type={props.type}
      dataFlag={props.dataFlag}
      width={null}
      borderSize={null}
      borderColor={null}
      disabledBorderColor={null}
      hoveredBorderColor={null}
      bgColor="bg-instillGrey90"
      hoveredBgColor="hover:bg-instillGrey80"
      textColor={null}
      hoveredTextColor={null}
      disabledBgColor="bg-instillGrey90"
      disabledTextColor={null}
      padding="p-[3px]"
    >
      {props.isCollapse ? (
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
