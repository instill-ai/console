import * as React from "react";
import { NotFoundView, PageBase } from "@instill-ai/toolkit";
import { NextPageWithLayout } from "./_app";
import { ConsoleCorePageHead } from "components";

const Custom404Page: NextPageWithLayout = () => {
  return (
    <React.Fragment>
      <ConsoleCorePageHead title="Not found" />
      <NotFoundView />;
    </React.Fragment>
  );
};

export default Custom404Page;
