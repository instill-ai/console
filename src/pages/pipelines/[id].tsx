import { FC, ReactElement } from "react";
import { PipelineNameForm, PipelineBuilderMainView } from "@instill-ai/toolkit";

import { PageBase, Topbar } from "@/components";
import { useRouter } from "next/router";

import { Logo } from "@instill-ai/design-system";

type GetLayOutProps = {
  page: ReactElement;
};

const PipelineBuilderPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const router = useRouter();
  return (
    <PageBase>
      <Topbar
        className="!border-b !border-semantic-bg-line !bg-semantic-bg-base-bg"
        logo={<Logo variant="colourLogomark" width={38} />}
      >
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
  );
};

export default PipelineBuilderPage;
