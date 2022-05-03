import { FC } from "react";
import ButtonBase, { ButtonBaseProps } from "../ButtonBase";

export type PrimaryButtonProps = Omit<ButtonBaseProps, "color" | "textColor">;

const PrimaryButton: FC<PrimaryButtonProps> = (props) => {
  return (
    <ButtonBase
      disabled={props.disabled}
      onClickHandler={props.onClickHandler}
      position={props.position}
      type={props.type}
      dataFlag={props.dataFlag}
      color="bg-instillBlue30"
      textColor="text-instillGrey05"
    >
      {props.children}
    </ButtonBase>
  );
};

export default PrimaryButton;
