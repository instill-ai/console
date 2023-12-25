import * as React from "react";
import { Button, Icons, Separator, Tag } from "@instill-ai/design-system";
import { useRouter } from "next/router";
import {
  InstillStore,
  Pipeline,
  useInstillStore,
  useShallow,
  useUserMe,
} from "../../lib";
import { sortPipelineReleases } from "../../view";
import { ClonePipelineDialog } from "../ClonePipelineDialog";

export const FooterSkeleton = () => {
  return (
    <div className="flex flex-col px-6 pb-4">
      <div className="flex flex-row">
        <div className="h-5 w-20 shrink-0 grow-0 animate-pulse rounded bg-semantic-bg-secondary"></div>
      </div>
      <Separator orientation="horizontal" className="my-2" />
      <div className="flex flex-row-reverse">
        <div className="h-10 w-[100px] shrink-0 grow-0 animate-pulse rounded bg-semantic-bg-secondary"></div>
      </div>
    </div>
  );
};

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const Footer = ({ pipeline }: { pipeline: Pipeline }) => {
  const router = useRouter();

  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const latestRelease = React.useMemo(() => {
    if (pipeline.releases.length === 0) {
      return null;
    }
    return sortPipelineReleases(pipeline.releases)[0].id;
  }, [pipeline]);

  const me = useUserMe({
    enabled: enabledQuery,
    accessToken,
  });

  return (
    <div className="flex flex-col px-6 pb-4">
      <div className="flex flex-row">
        {latestRelease ? (
          <Tag variant="darkBlue" size="sm">
            {latestRelease}
          </Tag>
        ) : null}
      </div>
      <Separator orientation="horizontal" className="my-2" />
      <div className="flex flex-row-reverse">
        {pipeline.permission.can_edit ? (
          <Button
            className="flex flex-row gap-x-2"
            variant="tertiaryGrey"
            size="lg"
            onClick={() => {
              router.push(
                `/${pipeline.owner_name.split("/")[1]}/pipelines/${
                  pipeline.id
                }/builder`
              );
            }}
          >
            <Icons.Edit03 className="h-4 w-4 stroke-semantic-fg-secondary" />
            Edit
          </Button>
        ) : me.isSuccess ? (
          <ClonePipelineDialog
            trigger={
              <Button
                className="flex flex-row gap-x-2"
                variant="tertiaryGrey"
                size="lg"
              >
                <Icons.Copy07 className="h-3 w-3 stroke-semantic-accent-default" />
                Clone
              </Button>
            }
            pipeline={pipeline}
          />
        ) : null}
      </div>
    </div>
  );
};
Footer.Skeleton = FooterSkeleton;
