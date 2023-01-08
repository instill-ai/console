import { GetSourceResponse } from "@/lib/instill";
import { env } from "@/utils/config";
import { rest } from "msw";

type GetSourceParam = {
  sourceId: string;
};

export const getPredefindedSource = (sourceId: string): GetSourceResponse => {
  return {
    source_connector: {
      name: `source-connectors/${sourceId}`,
      uid: "3a98d0ce-b738-40c4-a5ab-6b359f00b3ba",
      id: sourceId,
      source_connector_definition: `source-connector-definitions/${sourceId}`,
      connector: {
        description: "",
        configuration: {},
        state: "STATE_CONNECTED",
        tombstone: false,
        user: "users/local-user",
        create_time: "2022-06-14T05:14:47.801646Z",
        update_time: "2022-06-14T05:14:47.803989Z",
        org: "",
      },
    },
  };
};

const getSourceHandler = rest.get<
  Record<string, never>,
  GetSourceParam,
  GetSourceResponse
>(
  `${env("NEXT_PUBLIC_API_GATEWAY_BASE_URL")}/${env(
    "NEXT_PUBLIC_API_VERSION"
  )}/source-connectors/:sourceId`,
  (req, res, ctx) => {
    const { sourceId } = req.params;
    return res(ctx.json(getPredefindedSource(sourceId)));
  }
);

export default getSourceHandler;
