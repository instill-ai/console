import { ModelInstance, Pipeline } from "@/lib/instill";
import { Nullable } from "@/types/general";
import { StatefulToggleField } from "@instill-ai/design-system";
import { FC, useState, useEffect, useCallback } from "react";
import { UseMutationResult } from "react-query";
import cn from "clsx";
import { AxiosError } from "axios";

export type ChangeResourceStateSectionProps = {
  resource: Nullable<ModelInstance | Pipeline>;
  switchOff: UseMutationResult<
    ModelInstance | Pipeline,
    unknown,
    string,
    unknown
  >;
  switchOn: UseMutationResult<
    ModelInstance | Pipeline,
    unknown,
    string,
    unknown
  >;
  marginBottom?: string;
};

const ChangeResourceStateSection: FC<ChangeResourceStateSectionProps> = ({
  resource,
  switchOn,
  switchOff,
  marginBottom,
}) => {
  const [isChanging, setIsChanging] = useState(false);
  const [error, setError] = useState<Nullable<string>>(null);

  useEffect(() => {
    setError(null);
  }, [resource]);

  const changeResourceStateHandler = useCallback(() => {
    if (!resource) return;

    setIsChanging(true);

    if (
      resource.state === "STATE_ONLINE" ||
      resource.state === "STATE_ACTIVE"
    ) {
      switchOff.mutate(resource.name, {
        onSuccess: () => {
          setIsChanging(false);
        },
        onError: (error) => {
          setIsChanging(false);
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
        onSuccess: () => {
          setIsChanging(false);
        },
        onError: (error) => {
          setIsChanging(false);
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
  }, [switchOn, switchOff]);

  return (
    <div className={cn(marginBottom)}>
      <StatefulToggleField
        id="pipelineStateToggleButton"
        value={
          resource?.state === "STATE_ONLINE" ||
          resource?.state === "STATE_ACTIVE"
            ? true
            : false
        }
        disabled={false}
        readOnly={false}
        required={false}
        description={""}
        onChangeInput={changeResourceStateHandler}
        label="State"
        additionalMessageOnLabel={null}
        error={error}
        state={
          isChanging ? "STATE_LOADING" : resource?.state || "STATE_UNSPECIFIED"
        }
      />
    </div>
  );
};

export default ChangeResourceStateSection;
