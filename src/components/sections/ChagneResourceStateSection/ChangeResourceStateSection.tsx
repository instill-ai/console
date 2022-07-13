import { ModelInstance, Pipeline } from "@/lib/instill";
import { Nullable } from "@/types/general";
import { StatefulToggleField } from "@instill-ai/design-system";
import { FC, useState, useEffect, useCallback } from "react";
import { UseMutationResult } from "react-query";
import cn from "clsx";

export type ChangeResourceStateSectionProps = {
  resource: Nullable<ModelInstance | Pipeline>;
  deployResource: UseMutationResult<
    ModelInstance | Pipeline,
    unknown,
    string,
    unknown
  >;
  unDeployResource: UseMutationResult<
    ModelInstance | Pipeline,
    unknown,
    string,
    unknown
  >;
  marginBottom?: string;
};

const ChangeResourceStateSection: FC<ChangeResourceStateSectionProps> = ({
  resource,
  deployResource,
  unDeployResource,
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
      unDeployResource.mutate(resource.name, {
        onSuccess: () => {
          setIsChanging(false);
        },
        onError: () => {
          setIsChanging(false);
          setError("There is an error. Please try again.");
        },
      });
    } else {
      deployResource.mutate(resource.name, {
        onSuccess: () => {
          setIsChanging(false);
        },
        onError: () => {
          setIsChanging(false);
          setError("There is an error. Please try again.");
        },
      });
    }
  }, [deployResource, unDeployResource]);

  return (
    <div className={cn(marginBottom)}>
      <StatefulToggleField
        id="pipelineStateToggleButton"
        value={resource?.state === "STATE_ONLINE" ? true : false}
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
