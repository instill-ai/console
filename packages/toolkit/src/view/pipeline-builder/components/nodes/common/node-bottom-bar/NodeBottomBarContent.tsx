import {
  GeneralRecord,
  InstillJSONSchema,
  Nullable,
  useInstillStore,
} from "../../../../../../lib";
import { useNodeBottomBarContext } from "./NodeBottomBarContext";
import { NodeBottomBarOutput } from "./NodeBottomBarOutput";
import { NodeBottomBarSchema } from "./NodeBottomBarSchema";

export const NodeBottomBarContent = ({
  componentID,
  outputSchema,
  componentSchema,
}: {
  componentID: string;
  outputSchema: Nullable<InstillJSONSchema>;
  componentSchema: Nullable<GeneralRecord>;
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
      return <NodeBottomBarSchema componentSchema={componentSchema} />;
    }
    default: {
      return null;
    }
  }
};
