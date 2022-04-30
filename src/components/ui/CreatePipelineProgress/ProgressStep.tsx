import { FC, forwardRef } from "react";

export type ProgressStepProps = {
  stepNum: number;
  stepName: string;
};

const ProgressStep = forwardRef<HTMLDivElement, ProgressStepProps>(
  ({ stepNum, stepName }, ref) => {
    return (
      <div ref={ref} className="flex flex-col gap-y-3">
        <div className="mx-auto mb-auto flex h-[30px] w-[30px] bg-instillGrey20">
          <p className="instill-text-h3 m-auto text-instillGrey50">{stepNum}</p>
        </div>
        <p className="instill-text-small mx-auto text-instillGrey50">
          {stepName}
        </p>
      </div>
    );
  }
);

ProgressStep.displayName = "ProgressStep";

export default ProgressStep;
