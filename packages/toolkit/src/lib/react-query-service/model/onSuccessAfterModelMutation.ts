import { Model } from "../../vdp-sdk";
import { QueryClient } from "@tanstack/react-query";

export type OnSuccessAfterModelMutationProps =
  | OnSuccessAfterDeleteModelProps
  | OnSuccessAfterCreateModelProps
  | OnSuccessAfterUpdateModelProps
  | OnSuccessAfterDeployModelProps
  | OnSuccessAfterUndeployModelProps;

export type OnSuccessAfterDeleteModelProps = {
  type: "delete";
  queryClient: QueryClient;
  modelName: string;
};

export type OnSuccessAfterCreateModelProps = {
  type: "create";
  queryClient: QueryClient;
  modelName: string;
};

export type OnSuccessAfterUpdateModelProps = {
  type: "update";
  queryClient: QueryClient;
  model: Model;
};

export type OnSuccessAfterDeployModelProps = {
  type: "deploy";
  queryClient: QueryClient;
  modelName: string;
};

export type OnSuccessAfterUndeployModelProps = {
  type: "undeploy";
  queryClient: QueryClient;
  modelName: string;
};

export async function onSuccessAfterModelMutation(
  props: OnSuccessAfterModelMutationProps
) {
  const { type, queryClient } = props;

  if (type === "update") {
    const { model } = props;

    const modelNameArray = model.name.split("/");
    const userName = `${modelNameArray[0]}/${modelNameArray[1]}`;

    queryClient.setQueryData<Model>(["models", model.name], model);
    queryClient.setQueryData<Model[]>(["models"], (old) =>
      old ? [...old.filter((e) => e.name !== model.name), model] : [model]
    );

    queryClient.setQueryData<Model[]>(["models", userName], (old) =>
      old ? [...old.filter((e) => e.name !== model.name), model] : [model]
    );

    // Invalidate readme
    queryClient.invalidateQueries({
      queryKey: ["models", model.name, "readme"],
    });

    return;
  }

  const { modelName } = props;

  const modelNameArray = modelName.split("/");
  const userName = `${modelNameArray[0]}/${modelNameArray[1]}`;

  // Because deploy model is a long running operation, we will not
  // query the model and update the cache immediately. We left this
  // decision to the user.

  setTimeout(() => {
    queryClient.invalidateQueries({ queryKey: ["models"] });
    queryClient.invalidateQueries({ queryKey: ["models", userName] });
    queryClient.invalidateQueries({ queryKey: ["models", modelName] });
    queryClient.invalidateQueries({ queryKey: ["models", "watch"] });
    queryClient.invalidateQueries({ queryKey: ["models", modelName, "watch"] });
  }, 3000);
}
