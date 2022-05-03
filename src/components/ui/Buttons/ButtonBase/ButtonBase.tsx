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
};

const ButtonBase: FC<ButtonBaseProps> = ({
  color,
  buttonName,
  disabled,
  textColor,
  onClickHandler,
  position,
  type,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClickHandler}
      type={type}
      className={cn("rounded-[1px] px-5 py-2.5", color, textColor, position)}
    >
      {buttonName}
    </button>
  );
};

export default ButtonBase;
