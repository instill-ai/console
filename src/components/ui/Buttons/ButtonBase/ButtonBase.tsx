import { FC } from "react";
import cn from "clsx";

export type ButtonBaseProps = {
  disabled: boolean;
  disabledBgColor: string;
  disabledTextColor: string;
  bgColor: string;
  textColor: string;
  onClickHandler?: () => void;
  position?: string;
  type?: "button" | "submit" | "reset";
  dataFlag?: string | number;
};

const ButtonBase: FC<ButtonBaseProps> = ({
  bgColor,
  disabled,
  disabledBgColor,
  disabledTextColor,
  textColor,
  onClickHandler,
  position,
  type,
  dataFlag,
  children,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClickHandler}
      type={type}
      data-flag={dataFlag}
      className={cn(
        "rounded-[1px] px-5 py-2.5",
        disabled
          ? cn(disabledBgColor, disabledTextColor)
          : cn(bgColor, textColor),
        position
      )}
    >
      {children}
    </button>
  );
};

export default ButtonBase;
