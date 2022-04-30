import { FC } from "react";
import cn from "clsx";

export type ButtonProps = {
  buttonName: string;
  disabled: boolean;
  color: string;
  textColor: string;
  onClickHandler: () => void;
  position: string;
};

const Button: FC<ButtonProps> = ({
  color,
  buttonName,
  disabled,
  textColor,
  onClickHandler,
  position,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClickHandler}
      className={cn("rounded-[1px] px-5 py-2.5", color, textColor, position)}
    >
      {buttonName}
    </button>
  );
};

export default Button;
