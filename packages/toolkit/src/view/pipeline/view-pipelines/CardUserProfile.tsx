import { Button, Separator, Tag } from "@instill-ai/design-system";
import {
  InstillStore,
  Nullable,
  useInstillStore,
  useShallow,
  useUser,
} from "../../../lib";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const CardUserProfile = ({
  totalPipelines,
}: {
  totalPipelines: Nullable<number>;
}) => {
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const user = useUser({
    enabled: enabledQuery && !!accessToken,
    accessToken,
  });

  return (
    <div className="flex flex-col rounded-sm border border-semantic-bg-line p-3">
      <div className="flex flex-col gap-y-4">
        <div className="mx-auto h-20 w-20 shrink-0 grow-0 rounded-full bg-semantic-bg-line"></div>
        {!user.data?.first_name || !user.data?.last_name ? (
          <h3 className="mx-auto text-semantic-fg-primary product-headings-heading-3">
            {user.data?.id}
          </h3>
        ) : (
          <div className="mx-auto flex flex-col gap-y-1">
            <h3 className="text-semantic-fg-primary product-headings-heading-3">
              {`${user.data.first_name} ${user.data.last_name}`}
            </h3>
            <Tag className="mx-auto" variant="default" size="sm">
              {user.data.id}
            </Tag>
          </div>
        )}
        <p className="py-2 text-center text-semantic-fg-primary product-body-text-3-regular">
          Dani Sosa is someone who knows someone somewhere near your house.
        </p>
      </div>
      <Separator orientation="horizontal" className="my-4" />
      <div className="flex flex-col gap-y-2">
        <div className="flex flex-row gap-x-2">
          <p className="text-semantic-fg-primary product-body-text-2-semibold">
            My active pipelines
          </p>
          {totalPipelines ? (
            <p className="text-semantic-accent-default product-body-text-2-semibold">
              {totalPipelines}
            </p>
          ) : null}
        </div>
      </div>
      <Separator orientation="horizontal" className="my-4" />
      <div className="flex flex-col gap-y-2">
        <p className="py-2 text-semantic-fg-disabled product-body-text-3-medium">
          Access exclusive tools and insights.
        </p>
        <Button className="!w-full" size="md" variant="secondaryColour">
          Upgrade to Pro
        </Button>
      </div>
    </div>
  );
};
