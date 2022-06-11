import { FC } from "react";
import ButtonBase, { ButtonBaseProps } from "../ButtonBase";

export type OutlineButtonProps = Omit<ButtonBaseProps, "padding">;

const OutlineButton: FC<OutlineButtonProps> = (props) => {
  return (
    <ButtonBase
      disabled={props.disabled}
      onClickHandler={props.onClickHandler}
      position={props.position}
      type={props.type}
      dataFlag={props.dataFlag}
      bgColor={props.bgColor}
      textColor={props.textColor}
      disabledBgColor={props.disabledBgColor}
      disabledTextColor={props.disabledTextColor}
      width={props.width}
      padding="px-5 py-2.5"
    >
      {props.children}
    </ButtonBase>
  );
};

export default OutlineButton;
