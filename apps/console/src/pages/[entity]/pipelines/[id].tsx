import { useRouter } from "next/router";
import { Logo } from "@instill-ai/design-system";
import {
  PipelineNameForm,
  PipelineBuilderMainView,
  PageBase,
  Topbar,
} from "@instill-ai/toolkit";

import { ConsoleCorePageHead } from "../../../components";
import { NextPageWithLayout } from "../../_app";
import { useAccessToken } from "../../../lib/useAccessToken";
import { useTrackToken } from "../../../lib/useTrackToken";

const PipelineBuilderPage: NextPageWithLayout = () => {
  const router = useRouter();
  const accessToken = useAccessToken();
  useTrackToken({ enabled: true });

  return (
    <>
      <ConsoleCorePageHead title="Pipeline builder" />
      <PageBase>
        <Topbar logo={<Logo variant="colourLogomark" width={38} />}>
          <div className="flex px-6 py-[18px]">
            <PipelineNameForm
              accessToken={accessToken.isSuccess ? accessToken.data : null}
              enableQuery={accessToken.isSuccess}
            />
          </div>
        </Topbar>
        <PageBase.Container>
          <PipelineBuilderMainView
            router={router}
            accessToken={accessToken.isSuccess ? accessToken.data : null}
            enableQuery={accessToken.isSuccess}
          />
        </PageBase.Container>
      </PageBase>
    </>
  );
};

export default PipelineBuilderPage;
