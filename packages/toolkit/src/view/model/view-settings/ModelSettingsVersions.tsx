import {
  InstillStore,
  Model,
  useInstillStore,
  useInfiniteModelVersions,
  useShallow,
} from "../../../lib";

export type ModelSettingsVersionsProps = {
  model: Model;
};

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const ModelSettingsVersions = ({
  model,
}: ModelSettingsVersionsProps) => {
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const versions = useInfiniteModelVersions({
    accessToken,
    enabledQuery,
    id: model.id,
    entityName: model.owner_name,
  });

  console.log(versions);

  return <div>Versions</div>;
};
