import * as React from "react";
import { Button } from "@instill-ai/design-system";
import {
  InstillStore,
  useInstillStore,
  useShallow,
  validateUserPipeline,
} from "../../../../lib";
import { LoadingSpin } from "../../../../components";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  pipelineName: store.pipelineName,
  updatePipelineValidationErrors: store.updatePipelineValidationErrors,
});

export const Validate = () => {
  const [validating, setValidating] = React.useState(false);
  const { accessToken, pipelineName, updatePipelineValidationErrors } =
    useInstillStore(useShallow(selector));

  return (
    <Button
      size="md"
      variant="tertiaryGrey"
      className="flex !h-8 flex-row gap-x-2"
      onClick={async () => {
        if (!pipelineName) return;
        setValidating(true);
        try {
          const response = await validateUserPipeline({
            pipelineName,
            accessToken,
          });
          if (!response.success) {
            updatePipelineValidationErrors(() => response.errors);
          }
        } catch (error) {
          console.error(error);
        }

        setValidating(false);
      }}
    >
      {validating ? <LoadingSpin /> : "Validate"}
    </Button>
  );
};
