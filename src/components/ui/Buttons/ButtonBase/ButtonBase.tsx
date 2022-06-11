import { FC } from "react";
import cn from "clsx";
import { Nullable } from "@/types/general";

export type ButtonBaseProps = {
  disabled: boolean;
  disabledBgColor: string;
  disabledTextColor: string;
  bgColor: string;
  textColor: string;
  onClickHandler?: (values?: any) => any;
  position?: string;
  type?: "button" | "submit" | "reset";
  dataFlag?: string | number;
  padding: string;
  width: Nullable<string>;
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
  padding,
  width,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClickHandler}
      type={type}
      data-flag={dataFlag}
      className={cn(
        "rounded-[1px]",
        disabled
          ? cn(disabledBgColor, disabledTextColor)
          : cn(bgColor, textColor),
        position,
        padding,
        width
      )}
    >
      {children}
    </button>
  );
};

export default ButtonBase;
