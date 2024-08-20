///import * as React from "react";
import type { Pipeline } from "instill-sdk";

//import { ColumnDef, DataTable } from "@instill-ai/design-system";

/* import {
  EmptyView,
  LoadingSpin,
  PipelineRunStateLabel,
} from "../../../components"; */
/* import {
  convertToSecondsAndMilliseconds,
  formatDate,
  InstillStore,
  PipelineTriggerRecord,
  useInstillStore,
  usePipelineTriggers,
  useRouteInfo,
  useShallow,
} from "../../../lib"; */
//import { TABLE_PAGE_SIZE } from "./constants";
//import Link from "next/link";
import { useParams } from "next/navigation";
import { PipelineRunList, PipelineRunView as PipelineRun } from "./PipelineRunViews";

/* const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
}); */

export type PipelineRunsProps = {
  pipeline?: Pipeline;
};

export const PipelineRuns = ({ pipeline }: PipelineRunsProps) => {
  const { path } = useParams();
  
  if (path?.length === 1) {
    return <PipelineRunList pipeline={pipeline} />
  } else {
    return <PipelineRun pipeline={pipeline} id={path?.[1]} />
  }
};
