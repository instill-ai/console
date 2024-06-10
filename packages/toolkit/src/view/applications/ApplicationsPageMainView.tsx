import { Separator } from "@instill-ai/design-system";
import { GeneralAppPageProp, InstillStore, useAppEntity, useAuthenticatedUser, useInstillStore, useShallow } from "../../lib";
import { Messages } from "./components/Messages";
import { Sidebar } from "./components/Sidebar";
import { useMockCitations } from "../../lib/react-query-service/applications";

export type ApplicationsPageMainViewProps = GeneralAppPageProp;

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const ApplicationsPageMainView = (props: ApplicationsPageMainViewProps) => {
  const { accessToken, enableQuery, router } = props;

  const entity = useAppEntity();

  const { enabledQuery } = useInstillStore(useShallow(selector));

  const { data: me } = useAuthenticatedUser({ enabled: enabledQuery, accessToken });

  const { data: mockCitations = [] } = useMockCitations();

  return (
    <div className="flex flex-col px-8 gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-semantic-fg-default text-2xl font-semibold">app-formated-ID</h2>
      </div>
      <Separator dir="horizontal" />
      <div className="flex gap-2">
        <div className="flex flex-col flex-1 rounded shadow">
          <div className="p-2 bg-semantic-bg-base-bg rounded-t border-b border-semantic-bg-line product-body-text-1-semibold">
            Chat Playground
          </div>
          <Messages me={me} />
        </div>
        <Sidebar mockCitations={mockCitations} />
      </div>
    </div>
  );
};
