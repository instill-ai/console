import * as React from "react";
import { PipelineBuilderMainView } from "@instill-ai/toolkit";

import { ConsoleCorePageHead } from "../../../../components";
import { NextPageWithLayout } from "../../../_app";
import { useTrackToken } from "../../../../lib/useTrackToken";

const PipelineBuilderPage: NextPageWithLayout = () => {
  useTrackToken({ enabled: true });

  return (
    <React.Fragment>
      <ConsoleCorePageHead title="Pipeline builder" />
      <PipelineBuilderMainView />
    </React.Fragment>
  );
};

export default PipelineBuilderPage;
