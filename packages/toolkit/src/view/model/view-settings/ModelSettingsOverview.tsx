import {
  InstillStore,
  Model,
  useAppEntity,
  useInstillStore,
  useShallow,
  useUserModelReadme,
} from "../../../lib";

export type ModelSettingsOverviewProps = {
  model?: Model;
};

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const ModelSettingsOverview = ({
  model,
}: ModelSettingsOverviewProps) => {
  const entityObject = useAppEntity();
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const modelReadme = useUserModelReadme({
    modelName: model?.name || null,
    enabled: enabledQuery && entityObject.isSuccess,
    accessToken,
  });

  console.log(modelReadme);

  return <div></div>;
};
