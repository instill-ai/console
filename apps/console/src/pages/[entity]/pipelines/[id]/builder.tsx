import * as React from "react";
import { PipelineBuilderMainView } from "@instill-ai/toolkit";

import { ConsoleCorePageHead } from "../../../../components";
import { NextPageWithLayout } from "../../../_app";
import { useTrackToken } from "../../../../lib/useTrackToken";
import { useAccessToken } from "lib/use-access-token/client";

const PipelineBuilderPage: NextPageWithLayout = () => {
  useAccessToken();
  useTrackToken({ enabled: true });

  return (
    <React.Fragment>
      <ConsoleCorePageHead title="Pipeline Builder" />
      <PipelineBuilderMainView />
    </React.Fragment>
  );
};

export default PipelineBuilderPage;
