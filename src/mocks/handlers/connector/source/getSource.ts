import { GetSourceResponse } from "@/lib/instill";
import { rest } from "msw";

type GetSourceParam = {
  sourceId: string;
};

const getSourceHandler = rest.get<
  Record<string, never>,
  GetSourceParam,
  GetSourceResponse
>(
  `${process.env.NEXT_PUBLIC_CONNECTOR_API_ENDPOINT}/${process.env.NEXT_PUBLIC_API_VERSION}/source-connectors/:sourceId`,
  (req, res, ctx) => {
    const { sourceId } = req.params;
    return res(
      ctx.json({
        source_connector: {
          name: "source-connectors/source-http",
          uid: "3a98d0ce-b738-40c4-a5ab-6b359f00b3ba",
          id: "source-http",
          source_connector_definition:
            "source-connector-definitions/source-http",
          connector: {
            description: "",
            configuration: "{}",
            state: "STATE_CONNECTED",
            tombstone: false,
            user: "users/local-user",
            create_time: "2022-06-14T05:14:47.801646Z",
            update_time: "2022-06-14T05:14:47.803989Z",
            org: "",
          },
        },
      })
    );
  }
);

export default getSourceHandler;
