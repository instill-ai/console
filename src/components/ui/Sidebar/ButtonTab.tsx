import { FC, ReactElement } from "react";
import cn from "clsx";

export type ButtonTabProps = {
  tabName: string;
  isCollapsed: boolean;
  onClickHandler: () => void;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  getTextColor?: () => string;
};

const ButtonTab: FC<ButtonTabProps> = ({
  tabName,
  isCollapsed,
  startIcon,
  endIcon,
  onClickHandler,
  getTextColor,
}) => {
  return (
    <button
      className={cn(
        "group flex flex-row py-[15px] px-5 hover:bg-instillBlue50",
        {
          "gap-x-5": !isCollapsed,
        }
      )}
      onClick={onClickHandler}
    >
      {startIcon ? <div className="px-1"> {startIcon}</div> : null}
      {isCollapsed ? null : (
        <p
          className={cn(
            "my-auto text-base leading-[28px] group-hover:text-instillBlue10",
            getTextColor ? getTextColor() : "text-instillGrey30"
          )}
        >
          {tabName}
        </p>
      )}
      {endIcon ? <div className="ml-auto">{endIcon}</div> : null}
    </button>
  );
};

export default ButtonTab;
