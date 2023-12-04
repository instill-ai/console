import { useRouter } from "next/router";
import { useSortedReleases } from "../../pipeline-builder";
import { Button, Icons, Tag } from "@instill-ai/design-system";
import { Menu } from "./Menu";
import { InstillStore, useInstillStore, useShallow } from "../../../lib";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const Head = () => {
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));
  const router = useRouter();
  const { id, entity } = router.query;

  const releases = useSortedReleases({
    pipelineName: id ? `users/${entity}/pipelines/${id}` : null,
    accessToken,
    enabledQuery,
  });

  return (
    <div className="relative flex flex-col bg-semantic-bg-primary">
      <div className="flex flex-col gap-y-3 px-28 py-16">
        <div className="flex flex-row gap-x-3">
          <div className="h-6 w-6 rounded-full bg-semantic-bg-secondary" />
          <p className="product-headings-heading-4">
            <span className="text-semantic-fg-disabled">{`${entity}/`}</span>
            <span className="text-semantic-fg-primary">{id}</span>
          </p>
          {releases[0] ? (
            <Tag size="sm" variant="darkPurple">
              {releases[0]?.id}
            </Tag>
          ) : null}
        </div>
        <div className="flex w-full flex-row flex-wrap">
          <Tag size="sm" variant="default">
            Stability-AI
          </Tag>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex flex-row px-24">
        <div className="mr-auto">
          <Menu.Root defaultValue="overview">
            <Menu.Item value="overview">Overview</Menu.Item>
          </Menu.Root>
        </div>
        <div className="flex flex-row gap-x-2">
          <Button
            size="sm"
            variant="secondaryColour"
            className="flex flex-row gap-x-2"
          >
            <Icons.Copy07 className="h-3 w-3 stroke-semantic-accent-default" />
            Clone
          </Button>
          <Button
            size="sm"
            variant="secondaryColour"
            className="flex flex-row gap-x-2"
            onClick={() => router.push(`/${entity}/pipelines/${id}/builder`)}
          >
            Build
          </Button>
        </div>
      </div>
    </div>
  );
};
