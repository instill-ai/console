"use client";

import * as React from "react";
import {
  InstillStore,
  Nullable,
  useInstillStore,
  useShallow,
  useAuthenticatedUser,
  useUserPipeline,
  useAppEntity,
} from "../../../lib";
import { Head } from "./Head";
import { InOutPut } from "./InOutPut";
import { Readme } from "./Readme";
import { useRouter } from "next/navigation";
import { ReadOnlyPipelineBuilder } from "../../pipeline-builder";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const ViewPipeline = () => {
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));
  const [currentVersion, setCurrentVersion] =
    React.useState<Nullable<string>>(null);

  const router = useRouter();

  const me = useAuthenticatedUser({
    enabled: enabledQuery,
    accessToken,
    retry: false,
  });

  const entity = useAppEntity();

  const pipeline = useUserPipeline({
    pipelineName: entity.isSuccess ? entity.data.pipelineName : null,
    enabled: enabledQuery && entity.isSuccess,
    accessToken,
  });

  const isOwner = React.useMemo(() => {
    if (!pipeline.isSuccess || !me.isSuccess) {
      return false;
    }
    setCurrentVersion(pipeline.data?.releases[0]?.id);

    return pipeline.data.owner_name === me.data.name;
  }, [pipeline.isSuccess, pipeline.data, me.isSuccess, me.data]);

  React.useEffect(() => {
    if (pipeline.isError) {
      router.push("/404");
    }
  }, [pipeline.isError, router]);

  const pipelineRelease = React.useMemo(() => {
    if (
      !pipeline.isSuccess ||
      !currentVersion ||
      pipeline.data.releases.length === 0
    ) {
      return null;
    }
    return pipeline.data.releases.find(
      (release) => release.id === currentVersion
    );
  }, [pipeline.isSuccess, pipeline.data, currentVersion]);

  return (
    <div className="flex h-full flex-col">
      <Head
        handleVersion={(version) => {
          setCurrentVersion(version);
        }}
        currentVersion={currentVersion}
      />
      <div className="mx-auto flex flex-1 flex-row px-8">
        <div className="flex h-full w-[718px] flex-col gap-y-6 py-10 pr-10">
          <ReadOnlyPipelineBuilder
            pipelineName={pipeline.isSuccess ? pipeline.data.name : null}
            recipe={pipelineRelease?.recipe || pipeline.data?.recipe || null}
            metadata={
              pipelineRelease?.metadata || pipeline.data?.metadata || null
            }
            className="h-[378px] w-full"
          />
          <div className="w-full bg-semantic-bg-base-bg px-3 py-2 text-semantic-fg-primary product-body-text-1-semibold">
            Pipeline Description
          </div>
          <Readme
            isOwner={isOwner}
            readme={pipeline.isSuccess ? pipeline.data.readme : null}
          />
        </div>
        <div className="flex w-[594px] flex-col py-10 pr-4">
          <InOutPut currentVersion={currentVersion} />
        </div>
      </div>
    </div>
  );
};
