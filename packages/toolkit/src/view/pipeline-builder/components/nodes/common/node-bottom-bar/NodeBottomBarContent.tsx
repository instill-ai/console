import {
  InstillJSONSchema,
  Nullable,
  useInstillStore,
} from "../../../../../../lib";
import { useNodeBottomBarContext } from "./NodeBottomBarContext";
import { NodeBottomBarOutput } from "./NodeBottomBarOutput";

export const NodeBottomBarContent = ({
  componentID,
  outputSchema,
}: {
  componentID: string;
  outputSchema: Nullable<InstillJSONSchema>;
}) => {
  const { selectedValue } = useNodeBottomBarContext();

  const triggerResponse = useInstillStore(
    (store) => store.testModeTriggerResponse
  );

  switch (selectedValue) {
    case "output": {
      if (
        !triggerResponse ||
        !triggerResponse.metadata ||
        !triggerResponse.metadata.traces ||
        !triggerResponse.metadata.traces[componentID] ||
        !triggerResponse.metadata.traces[componentID].outputs ||
        triggerResponse.metadata.traces[componentID].outputs.length === 0
      ) {
        return (
          <NodeBottomBarOutput
            componentID={componentID}
            outputSchema={outputSchema}
            outputData={{}}
          />
        );
      }

      const value = triggerResponse.metadata.traces[componentID].outputs[0];

      return (
        <NodeBottomBarOutput
          componentID={componentID}
          outputSchema={outputSchema}
          outputData={value}
        />
      );
    }
    case "schema": {
      return null;
    }
    default: {
      return null;
    }
  }
};
