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
    modelName: model.name,
  });

  setTimeout(() => {
    if (versions.hasNextPage) {
      versions.fetchNextPage();
    }
  }, 5000);

  return <div>Versions</div>;
};
