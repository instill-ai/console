import { FC } from "react";
import ButtonBase, { ButtonBaseProps } from "../ButtonBase";

export type PrimaryButtonProps = Omit<
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
>;

const PrimaryButton: FC<PrimaryButtonProps> = (props) => {
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
      bgColor="bg-instillBlue50"
      textColor="text-instillGrey05"
      disabledBgColor="bg-instillGrey15"
      disabledTextColor="text-instillGrey50"
      padding="px-5 py-2.5"
    >
      {props.children}
    </ButtonBase>
  );
};

export default PrimaryButton;
