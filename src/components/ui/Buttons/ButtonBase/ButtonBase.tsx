import { FC } from "react";
import cn from "clsx";
import { Nullable } from "@/types/general";

export type ButtonBaseProps = {
  type: "button" | "submit" | "reset";
  disabled: boolean;
  onClickHandler: Nullable<(values?: any) => any>;
  bgColor: Nullable<string>;
  hoveredBgColor: Nullable<string>;
  disabledBgColor: Nullable<string>;
  textColor: Nullable<string>;
  hoveredTextColor: Nullable<string>;
  disabledTextColor: Nullable<string>;
  borderSize: Nullable<string>;
  borderColor: Nullable<string>;
  hoveredBorderColor: Nullable<string>;
  disabledBorderColor: Nullable<string>;
  position: Nullable<string>;
  dataFlag?: Nullable<string | number>;
  padding: Nullable<string>;
  width: Nullable<string>;
};

const ButtonBase: FC<ButtonBaseProps> = ({
  bgColor,
  hoveredBgColor,
  disabled,
  disabledBgColor,
  disabledTextColor,
  textColor,
  hoveredTextColor,
  onClickHandler,
  position,
  type,
  dataFlag,
  children,
  padding,
  width,
  borderSize,
  borderColor,
  hoveredBorderColor,
  disabledBorderColor,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClickHandler ? onClickHandler : undefined}
      type={type}
      data-flag={dataFlag}
      className={cn(
        "group rounded-[1px]",
        borderSize,
        disabled
          ? cn(disabledBgColor, disabledTextColor, disabledBorderColor)
          : cn(
              bgColor,
              hoveredBgColor,
              textColor,
              hoveredTextColor,
              borderColor,
              hoveredBorderColor
            ),
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
