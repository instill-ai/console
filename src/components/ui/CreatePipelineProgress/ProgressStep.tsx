import { forwardRef } from "react";
import cn from "clsx";

export type ProgressStepProps = {
  stepNum: number;
  stepName: string;
  isCurrent: boolean;
};

const ProgressStep = forwardRef<HTMLDivElement, ProgressStepProps>(
  ({ stepNum, stepName, isCurrent }, cubeRef) => {
    return (
      <div className="flex flex-col gap-y-3">
        <div
          ref={cubeRef}
          className={cn(
            "z-10 mx-auto mb-auto box-border flex h-[30px] w-[30px]",
            isCurrent
              ? "border border-instillBlue50 bg-instillBlue10"
              : "bg-instillGrey20"
          )}
        >
          <p
            className={cn(
              "instill-text-h3 m-auto",
              isCurrent ? "text-instillBlue50" : "text-instillGrey50"
            )}
          >
            {stepNum}
          </p>
        </div>
        <p
          className={cn(
            "instill-text-small mx-auto",
            isCurrent ? "text-instillBlue50" : "text-instillGrey50"
          )}
        >
          {stepName}
        </p>
      </div>
    );
  }
);

ProgressStep.displayName = "ProgressStep";

export default ProgressStep;
