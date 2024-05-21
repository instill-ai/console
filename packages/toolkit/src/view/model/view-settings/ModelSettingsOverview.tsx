import { Model } from "../../../lib";

export type ModelSettingsOverviewProps = {
  model?: Model;
};

export const ModelSettingsOverview = ({
  model,
}: ModelSettingsOverviewProps) => {
  return <div>{model?.name}</div>;
};
