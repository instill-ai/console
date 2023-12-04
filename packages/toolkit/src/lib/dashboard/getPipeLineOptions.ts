import { SelectOption } from "@instill-ai/design-system";
import { Pipeline } from "../vdp-sdk";

export function getPipeLineOptions(pipelines: Pipeline[]): SelectOption[] {
  const formattedPinelineOptions = pipelines?.map((pipeline) => {
    return {
      label: pipeline.id,
      value: pipeline.id,
    };
  });

  return [
    {
      label: "ALL",
      value: "all",
    },
    ...formattedPinelineOptions,
  ];
}
