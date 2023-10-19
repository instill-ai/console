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

  const changeModelInstanceStateHandler = React.useCallback(() => {
    if (!model || !modelWatchState || modelWatchState === "STATE_UNSPECIFIED") {
      return;
    }
    if (modelWatchState === "STATE_ONLINE") {
      setIsChangingState(true);
      switchOff.mutate(
        {
          modelName: model.name,
          accessToken,
        },
        {
          onError: (error) => {
            if (axios.isAxiosError(error)) {
              setError(
                error.response?.data.message ??
                  "There is an error. Please try again."
              );
            } else {
              setError("There is an error. Please try again.");
            }
          },
          onSuccess: () => {
            setTimeout(() => {
              setIsChangingState(false);
            }, 3000);
          },
        }
      );
    } else {
      setIsChangingState(true);
      switchOn.mutate(
        {
          modelName: model.name,
          accessToken,
        },
        {
          onError: (error) => {
            if (axios.isAxiosError(error)) {
              setError(
                error.response?.data.message ??
                  "There is an error. Please try again."
              );
            } else {
              setError("There is an error. Please try again.");
            }
          },
          onSuccess: () => {
            setTimeout(() => {
              setIsChangingState(false);
            }, 3000);
          },
        }
      );
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
