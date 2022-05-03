import { FC } from "react";
import cn from "clsx";

export type ButtonBaseProps = {
  buttonName: string;
  disabled: boolean;
  color: string;
  textColor: string;
  onClickHandler: () => void;
  position: string;
  type?: "button" | "submit" | "reset";
  dataFlag?: string | number;
};

const ButtonBase: FC<ButtonBaseProps> = ({
  color,
  buttonName,
  disabled,
  textColor,
  onClickHandler,
  position,
  type,
  dataFlag,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClickHandler}
      type={type}
      data-flag={dataFlag}
      className={cn("rounded-[1px] px-5 py-2.5", color, textColor, position)}
    >
      {buttonName}
    </button>
  );
};

export default ButtonBase;
