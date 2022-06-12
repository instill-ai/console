import { FC } from "react";
import cn from "clsx";
import { Nullable } from "@/types/general";

export type ButtonBaseProps = {
  type: "button" | "submit" | "reset";
  disabled: boolean;
  onClickHandler: Nullable<(values?: any) => any>;
  bgColor: Nullable<string>;
  disabledBgColor: Nullable<string>;
  textColor: Nullable<string>;
  disabledTextColor: Nullable<string>;
  borderSize: Nullable<string>;
  borderColor: Nullable<string>;
  disabledBorderColor: Nullable<string>;
  position: Nullable<string>;
  dataFlag?: Nullable<string | number>;
  padding: Nullable<string>;
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
      onClick={onClickHandler ? onClickHandler : undefined}
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
