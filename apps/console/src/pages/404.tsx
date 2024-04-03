import * as React from "react";
import { NotFoundView } from "@instill-ai/toolkit";
import { NextPageWithLayout } from "./_app";
import { ConsoleCorePageHead } from "components";

const Custom404Page: NextPageWithLayout = () => {
  return (
    <React.Fragment>
      <ConsoleCorePageHead title="Not Found" />
      <NotFoundView />;
    </React.Fragment>
  );
};

export default Custom404Page;
