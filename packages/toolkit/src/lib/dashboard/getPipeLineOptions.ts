import type { Pipeline } from "instill-sdk";

import { SelectOption } from "@instill-ai/design-system";

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
