import { getElementPosition } from "@instill-ai/design-system";
import useOnScreen from "@/hooks/useOnScreen";
import { FC, useMemo, useRef } from "react";
import ProgressStep from "./ProgressStep";

export type CreatePipelineProgressProps = {
  currentProgress: "dataSoruce" | "model" | "dataDestination" | "pipeline";
};

const CreatePipelineProgress: FC<CreatePipelineProgressProps> = ({
  currentProgress,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const firstStepCubeRef = useRef<HTMLDivElement>(null);
  const lastStepCubeRef = useRef<HTMLDivElement>(null);

  const contanierIsOnScreen = useOnScreen(containerRef);

  const startPosition = useMemo(() => {
    if (!contanierIsOnScreen) {
      return {
        x: 0,
        y: 0,
      };
    }

    const containerPosition = getElementPosition(
      containerRef.current as HTMLDivElement
    );
    const firstStepPosition = getElementPosition(
      firstStepCubeRef.current as HTMLDivElement
    );

    const startPositionX =
      firstStepPosition.x - containerPosition.x + firstStepPosition.width;

    const startPositionY =
      firstStepPosition.y - containerPosition.y + firstStepPosition.height / 2;

    return {
      x: startPositionX,
      y: startPositionY,
    };
  }, [contanierIsOnScreen]);

  const endPosition = useMemo(() => {
    if (!contanierIsOnScreen) {
      return {
        x: 0,
        y: 0,
      };
    }

    const containerPosition = getElementPosition(
      containerRef.current as HTMLDivElement
    );
    const lastStepPosition = getElementPosition(
      lastStepCubeRef.current as HTMLDivElement
    );

    const endPositionX = lastStepPosition.x - containerPosition.x;

    console.log(lastStepPosition, containerPosition);

    const endPositionY =
      lastStepPosition.y - containerPosition.y + lastStepPosition.height / 2;

    console.log(endPositionX);

    return {
      x: endPositionX,
      y: endPositionY,
    };
  }, [contanierIsOnScreen]);

  return (
    <div ref={containerRef} className="relative">
      <div className="grid grid-cols-4">
        <ProgressStep
          stepNum={1}
          stepName="Date source"
          ref={firstStepCubeRef}
          isCurrent={currentProgress === "dataSoruce" ? true : false}
        />
        <ProgressStep
          stepNum={2}
          stepName="Model"
          isCurrent={currentProgress === "model" ? true : false}
        />
        <ProgressStep
          stepNum={3}
          stepName="Data Destination"
          isCurrent={currentProgress === "dataDestination" ? true : false}
        />
        <ProgressStep
          stepNum={4}
          stepName="Pipeline"
          ref={lastStepCubeRef}
          isCurrent={currentProgress === "pipeline" ? true : false}
        />
      </div>
      <div
        className="absolute -z-10 h-[1px] border-t border-instillGrey20"
        style={{
          top: startPosition?.y,
          left: startPosition?.x,
          width: `${endPosition.x - startPosition.x}px`,
        }}
      ></div>
    </div>
  );
};

export default CreatePipelineProgress;
