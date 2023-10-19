import { SingleSelectOption } from "@instill-ai/design-system";
import { Pipeline } from "../vdp-sdk";

export function getPipeLineOptions(
  pipelines: Pipeline[]
): SingleSelectOption[] {
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
