import type { Model } from "instill-sdk";
import { useParams } from "next/navigation";
import { ModelRun, ModelRunList/* , ModelRun */ } from "./ModelRunViews";

export type ModelRunsProps = {
  model?: Model;
};

export const ModelRuns = ({ model }: ModelRunsProps) => {
  const { path } = useParams();
  
  if (path?.length === 1) {
    return <ModelRunList model={model} />
  } else {
    return <ModelRun model={model} id={path?.[1]} />
  }
};
