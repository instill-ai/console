import { FC } from "react";
import cn from "clsx";
import { Nullable } from "@/types/general";

export type ButtonBaseProps = {
  disabled: boolean;
  disabledBgColor: string;
  disabledTextColor: string;
  borderSize: Nullable<string>;
  borderColor: Nullable<string>;
  disabledBorderColor: Nullable<string>;
  bgColor: Nullable<string>;
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
  borderSize,
  borderColor,
  disabledBorderColor,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClickHandler}
      type={type}
      data-flag={dataFlag}
      className={cn(
        "rounded-[1px]",
        borderSize,
        disabled
          ? cn(disabledBgColor, disabledTextColor, disabledBorderColor)
          : cn(bgColor, textColor, borderColor),
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
