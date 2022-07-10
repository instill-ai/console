import { FC, ReactElement } from "react";
import cn from "clsx";

export type ButtonTabProps = {
  tabName: string;
  isCollapsed: boolean;
  icon: ReactElement;
  onClickHandler: () => void;
};

const ButtonTab: FC<ButtonTabProps> = ({
  tabName,
  isCollapsed,
  icon,
  onClickHandler,
}) => {
  return (
    <button
      className={cn(
        "group flex flex-row py-[15px] px-8 hover:bg-instillBlue50",
        {
          "gap-x-5": !isCollapsed,
        }
      )}
      onClick={onClickHandler}
    >
      <div className="px-1">{icon}</div>
      {isCollapsed ? null : (
        <p
          className={cn(
            "my-auto text-base leading-[28px] text-instillGrey30 group-hover:text-instillBlue10"
          )}
        >
          {tabName}
        </p>
      )}
    </button>
  );
};

export default ButtonTab;
