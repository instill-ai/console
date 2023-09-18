import { useRouter } from "next/router";
import { Logo } from "@instill-ai/design-system";
import {
  PipelineNameForm,
  PipelineBuilderMainView,
  PageBase,
  Topbar,
} from "@instill-ai/toolkit";

import { ConsoleCorePageHead } from "@/components";
import { NextPageWithLayout } from "@/pages/_app";

const PipelineBuilderPage: NextPageWithLayout = () => {
  const router = useRouter();
  return (
    <>
      <ConsoleCorePageHead title="Pipeline builder" />
      <PageBase>
        <Topbar logo={<Logo variant="colourLogomark" width={38} />}>
          <div className="flex px-6 py-[18px]">
            <PipelineNameForm accessToken={null} enableQuery={true} />
          </div>
        </Topbar>
        <PageBase.Container>
          <PipelineBuilderMainView
            router={router}
            accessToken={null}
            enableQuery={true}
          />
        </PageBase.Container>
      </PageBase>
    </>
  );
};

export default PipelineBuilderPage;
