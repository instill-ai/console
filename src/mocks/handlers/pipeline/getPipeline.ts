import { GetPipelineResponse } from "@/lib/instill";
import { rest } from "msw";

type GetPipelineParam = {
  pipelineId: string;
};

const getPipelineHandler = rest.get<
  Record<string, never>,
  GetPipelineParam,
  GetPipelineResponse
>("/pipelines/:pipelineId", (req, res, ctx) => {
  const { pipelineId } = req.params;
  return res(
    ctx.json({
      pipeline: {
        name: `pipelines/${pipelineId}`,
        uid: "4ed56dad-9ff7-494f-8b6e-2c47cd24cd20",
        id: pipelineId,
        description: "This is a test pipeline mockup",
        mode: "MODE_SYNC",
        state: "STATE_ACTIVE",
        user: "users/b5ad4b82-b126-4aa9-b0e0-6c172f313433",
        org: "",
        create_time: "2022-05-25T02:13:54.641028Z",
        update_time: "2022-05-25T02:13:54.641028Z",
        recipe: {
          destination: "",
          source: "",
          model_instances: "",
        },
      },
    })
  );
});

export default getPipelineHandler;
