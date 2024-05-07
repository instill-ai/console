import { z } from "zod";
import { InstillErrors } from "../../constant";
import { validateInstillID } from "../../server";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Nullable, useModelDefinitions } from "../../lib";

// "model_definition": "model-definitions/container",

export type CreateModelFormProps = {
  accessToken: Nullable<string>;
  enabledQuery: boolean;
}

const CreateModelSchema = z
  .object({
    id: z.string(),
    description: z.string().optional().nullable(),
    visibility: z.enum(["VISIBILITY_PRIVATE", "VISIBILITY_PUBLIC"]).default("VISIBILITY_PRIVATE"),
    region: z.enum(["REGION_GCP_EUROPE_WEST_4"]).default("REGION_GCP_EUROPE_WEST_4"),
    hardware: z.enum(["CPU"]).default("CPU"),
    task: z.enum(["TASK_CLASSIFICATION", "TASK_DETECTION", "TASK_KEYPOINT", "TASK_OCR", "TASK_INSTANCE_SEGMENTATION", "TASK_SEMANTIC_SEGMENTATION", "TASK_TEXT_GENERATION", "TASK_TEXT_TO_IMAGE", "TASK_IMAGE_TO_IMAGE", "TASK_IMAGE_TO_TEXT"]).default("TASK_CLASSIFICATION"),
    configuration: z.object({}),
  })
  .superRefine((state, ctx) => {
    if (!validateInstillID(state.id)) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: InstillErrors.IDInvalidError,
        path: ["id"],
      });
    }
  });

export const CreateModelForm = (props: CreateModelFormProps) => {
  const { accessToken, enabledQuery } = props;

  const modelDefinitions = useModelDefinitions({
    enabled: enabledQuery,
    accessToken,
  });

  /* const form = useForm<z.infer<typeof CreateModelSchema>>({
    resolver: zodResolver(CreateModelSchema),
    mode: "onChange",
  }); */

  console.log(modelDefinitions);

  return (
    <div>123</div>
  )
}