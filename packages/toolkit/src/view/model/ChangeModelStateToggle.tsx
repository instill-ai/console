import cn from "clsx";
import axios from "axios";
import { StatefulToggleField } from "@instill-ai/design-system";
import * as React from "react";
import { UseMutationResult } from "@tanstack/react-query";

import { Model, ModelState, Nullable } from "../../lib";

export type ChangeModelStateToggleProps = {
  model: Nullable<Model>;
  modelWatchState: Nullable<ModelState>;
  switchOff: UseMutationResult<
    { modelName: string; accessToken: Nullable<string> },
    unknown,
    {
      modelName: string;
      accessToken: Nullable<string>;
    },
    unknown
  >;
  switchOn: UseMutationResult<
    { modelName: string; accessToken: Nullable<string> },
    unknown,
    {
      modelName: string;
      accessToken: Nullable<string>;
    },
    unknown
  >;
  /**
   * - Default is undefined
   */
  accessToken: Nullable<string>;
  marginBottom?: string;
  disabled?: boolean;
};

export const ChangeModelStateToggle = ({
  model,
  modelWatchState,
  switchOn,
  switchOff,
  marginBottom,
  accessToken,
  disabled,
}: ChangeModelStateToggleProps) => {
  const [error, setError] = React.useState<Nullable<string>>(null);
  const [isChangingState, setIsChangingState] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (modelWatchState === "STATE_ERROR") {
      setError("Something went wrong. Please try again.");
    } else {
      setError(null);
    }
  }, [modelWatchState]);

  const changeModelInstanceStateHandler = React.useCallback(async () => {
    if (!model || !modelWatchState || modelWatchState === "STATE_UNSPECIFIED") {
      return;
    }

    setIsChangingState(true);

    try {
      const payload = {
        modelName: model.name,
        accessToken,
      };

      if (modelWatchState === "STATE_ONLINE") {
        await switchOff.mutateAsync(payload);
      } else {
        await switchOn.mutateAsync(payload);
      }

      setTimeout(() => {
        setIsChangingState(false);
      }, 3000);
    } catch (error) {
      const axiosErrorMessage =
        axios.isAxiosError(error) && error.response?.data.message;
      if (!axiosErrorMessage) {
        setError("There is an error. Please try again.");
        return;
      }
      setError(axiosErrorMessage);
    }
  }, [switchOn, switchOff, model, accessToken, modelWatchState]);

  return (
    <div className={cn("flex flex-row", marginBottom)}>
      <StatefulToggleField
        id="model-state-toggle"
        value={modelWatchState === "STATE_ONLINE" ? true : false}
        onChange={changeModelInstanceStateHandler}
        label="State"
        error={error}
        state={
          modelWatchState === "STATE_UNSPECIFIED" || isChangingState
            ? "STATE_LOADING"
            : modelWatchState || "STATE_UNSPECIFIED"
        }
        disabled={disabled ? true : modelWatchState === "STATE_UNSPECIFIED"}
        loadingLabelText="Model is in the long running operation, please wait on this page to get the new status"
      />
    </div>
  );
};
