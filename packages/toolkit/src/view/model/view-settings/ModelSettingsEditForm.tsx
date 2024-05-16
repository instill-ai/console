import { z } from "zod";
import { VISIBILITY } from "../CreateModelForm";

const EditModelSchema = z
  .object({
    description: z.string().optional(),
    source_url: z.string().optional(),
    documentation_url: z.string().optional(),
    license: z.string().optional(),
    visibility: z.enum(VISIBILITY).default(VISIBILITY[0]),
    hardware: z.string(),
    //configuration: z.object({}),
  })
  .superRefine((state, ctx) => {
    console.log(state);
  });

export const ModelSettingsEditForm = () => {
  return <div>123</div>;
};
