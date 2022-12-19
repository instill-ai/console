import { ModelInstance, Pipeline } from "@/lib/instill";
import { Nullable } from "@/types/general";
import { StatefulToggleField } from "@instill-ai/design-system";
import { FC, useState, useEffect, useCallback, useRef } from "react";
import { UseMutationResult } from "react-query";
import cn from "clsx";
import { AxiosError } from "axios";
import { Operation } from "@/lib/instill/types";

export type ChangeResourceStateButtonProps = {
  resource: Nullable<ModelInstance | Pipeline>;
  switchOff: UseMutationResult<
    { modelInstance: ModelInstance; operation: Operation } | Pipeline,
    unknown,
    string,
    unknown
  >;
  switchOn: UseMutationResult<
    { modelInstance: ModelInstance; operation: Operation } | Pipeline,
    unknown,
    string,
    unknown
  >;
  marginBottom?: string;
};

const ChangeResourceStateButton: FC<ChangeResourceStateButtonProps> = ({
  resource,
  switchOn,
  switchOff,
  marginBottom,
}) => {
  const [error, setError] = useState<Nullable<string>>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const initialResourceState = useRef(resource?.state);

  useEffect(() => {
    setError(null);
  }, [resource]);

  useEffect(() => {
    if (initialResourceState.current !== null && resource) {
      if (initialResourceState.current !== resource.state) {
        setIsProcessing(false);
        initialResourceState.current = resource.state;
      }
    }
  }, [resource?.state]);

  const changeResourceStateHandler = useCallback(() => {
    if (!resource || isProcessing) return;

    setIsProcessing(true);

    if (
      resource.state === "STATE_ONLINE" ||
      resource.state === "STATE_ACTIVE"
    ) {
      switchOff.mutate(resource.name, {
        onError: (error) => {
          if (error instanceof AxiosError) {
            setError(
              error.response?.data.message ??
                "There is an error. Please try again."
            );
          } else {
            setError("There is an error. Please try again.");
          }
        },
      });
    } else {
      switchOn.mutate(resource.name, {
        onError: (error) => {
          if (error instanceof AxiosError) {
            setError(
              error.response?.data.message ??
                "There is an error. Please try again."
            );
          } else {
            setError("There is an error. Please try again.");
          }
        },
      });
    }
  }, [switchOn, switchOff, resource, isProcessing]);

  return (
    <div className={cn("flex flex-row", marginBottom)}>
      <StatefulToggleField
        id="pipelineStateToggleButton"
        value={
          resource?.state === "STATE_ONLINE" ||
          resource?.state === "STATE_ACTIVE"
            ? true
            : false
        }
        onChange={changeResourceStateHandler}
        label="State"
        error={error}
        state={
          isProcessing
            ? "STATE_LOADING"
            : resource?.state || "STATE_UNSPECIFIED"
        }
        disabled={resource?.state === "STATE_UNSPECIFIED"}
        loadingLabelText="Model instance is in the long running operation, please refresh this page to get the new status"
      />
    </div>
  );
};

export default ChangeResourceStateButton;
