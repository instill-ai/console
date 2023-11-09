import cn from "clsx";
import * as React from "react";
import { PixelCheckIcon, PixelCrossIcon, XIcon } from "../../Icons";
import NoBgSquareProgress from "../../Progress/NoBgSquareProgress";
import { Nullable } from "../../../types/general";

export type ProgressMessageBoxState = {
  status: Nullable<"success" | "error" | "progressing">;
  /**
   *  ProgressMessageBox's message
   */
  message: Nullable<string>;
  /**
   * ProgressMessageBox's description
   */
  description: Nullable<string>;

  /**
   * Show message box or not
   */
  activate: boolean;
};

export type ProgressMessageBoxBaseProps = {
  /** The width of the whole message box
   * - e.g. w-120
   */
  width: string;

  /**
   * Error icon color
   * - e.g. fill-instillRed
   */
  errorIconColor: string;

  /**
   * Error icon width
   * - e.g. w-4
   */
  errorIconWidth: string;

  /**
   * Error icon height
   * - e.g. h-4
   */
  errorIconHeight: string;

  /**
   * Success icon color
   * - e.g. fill-instillRed
   */
  successIconColor: string;

  /**
   * Success icon width
   * - e.g. w-4
   */
  successIconWidth: string;

  /**
   * Success icon height
   * - e.g. h-4
   */
  successIconHeight: string;

  /** The position of the Icon
   * - e.g. mx-auto
   */
  iconPosition: string;

  /** The size of the Square progress */
  progressBlockSize: number;

  /** Indicator background color when error processing
   * - e.g. bg-instillGrey50
   */
  processingIndicatorColumnBgColor: string;

  /** Indicator background color when error occur
   * - e.g. bg-instillGrey50
   */
  errorindicatorColumnBgColor: string;

  /** Indicator background color when success
   * - e.g. bg-instillGrey50
   */
  successIndicatorColumnBgColor: string;

  /** The width of the column that contains the indicator like success icon or progress
   * - e.g. w-12
   */
  indicatorColumnWidth: string;

  /** The top left border radius of the column that contains the indicator like success icon or progress
   * - e.g. rounded-tl-[1px]
   */
  indicatorColumnTopLeftBorderRadius: string;

  /** The bottom left border radius of the column that contains the indicator like success icon or progress
   * - e.g. rounded-bl-[1px]
   */
  indicatorColumnBottomLeftBorderRadius: string;

  /** The background color of the column that contains the message
   * - e.g. bg-instillGrey50
   */
  messageColumnBgColor: string;

  /** The bottom right border of the column that contains the message
   * - e.g. rounded-br-[1px]
   */
  messageColumnBottomRightBorderRadius: string;

  /** The top right border of the column that contains the message
   * - e.g. rounded-tr-[1px]
   */
  messageColumnTopRightBorderRadius: string;

  boxBorderRadius: string;

  /**
   * Whether the message box can be closed or not
   */
  closable: boolean;

  state: ProgressMessageBoxState;

  setActivate: (activate: boolean) => void;
};

const ProgressMessageBoxBase = (props: ProgressMessageBoxBaseProps) => {
  const {
    state,
    setActivate,
    width,
    errorIconColor,
    errorIconWidth,
    errorIconHeight,
    successIconColor,
    successIconWidth,
    successIconHeight,
    progressBlockSize,
    iconPosition,
    successIndicatorColumnBgColor,
    processingIndicatorColumnBgColor,
    errorindicatorColumnBgColor,
    indicatorColumnWidth,
    indicatorColumnBottomLeftBorderRadius,
    indicatorColumnTopLeftBorderRadius,
    messageColumnBgColor,
    messageColumnBottomRightBorderRadius,
    messageColumnTopRightBorderRadius,
    boxBorderRadius,
    closable,
  } = props;

  const statusIcon = React.useMemo(() => {
    switch (state.status) {
      case "error":
        return (
          <PixelCrossIcon
            width={errorIconWidth}
            height={errorIconHeight}
            position="mx-auto mb-auto"
            color={errorIconColor}
          />
        );
      case "progressing":
        return (
          <NoBgSquareProgress
            isLoading={true}
            blockSize={progressBlockSize}
            position={iconPosition}
          />
        );

      case "success":
        return (
          <PixelCheckIcon
            width={successIconWidth}
            height={successIconHeight}
            position={iconPosition}
            color={successIconColor}
          />
        );
      default:
        return null;
    }
  }, [
    state.status,
    errorIconColor,
    errorIconHeight,
    errorIconWidth,
    iconPosition,
    progressBlockSize,
    successIconColor,
    successIconHeight,
    successIconWidth,
  ]);

  return state.activate ? (
    <div
      className={cn(
        "flex min-h-[85px] flex-row instill-progress-message-box-shadow",
        width,
        boxBorderRadius
      )}
    >
      <div
        className={cn(
          "flex p-2.5",
          indicatorColumnWidth,
          indicatorColumnBottomLeftBorderRadius,
          indicatorColumnTopLeftBorderRadius,
          state.status === "error"
            ? errorindicatorColumnBgColor
            : state.status === "success"
            ? successIndicatorColumnBgColor
            : processingIndicatorColumnBgColor
        )}
      >
        {statusIcon}
      </div>
      <div
        className={cn(
          "flex flex-1 flex-row py-2.5 pl-[15px] pr-2.5",
          messageColumnBgColor,
          messageColumnBottomRightBorderRadius,
          messageColumnTopRightBorderRadius
        )}
      >
        <div className="flex flex-1 flex-col gap-y-[5px]">
          <h3 className="text-instill-h3 break-normal text-instillGrey90">
            {state.message}
          </h3>
          <p className="text-instill-small text-instillGrey70">
            {state.description}
          </p>
        </div>
        {closable ? (
          <button onClick={() => setActivate(false)} className="mb-auto flex">
            <XIcon
              position="m-auto"
              color="fill-instillGrey30"
              width="w-4"
              height="h-4"
            />
          </button>
        ) : null}
      </div>
    </div>
  ) : null;
};

export default ProgressMessageBoxBase;
