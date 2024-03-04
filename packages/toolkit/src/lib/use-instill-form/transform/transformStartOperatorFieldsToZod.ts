/* eslint-disable @typescript-eslint/no-explicit-any */

import * as z from "zod";
import { Nullable } from "../../type";
import { PipelineStartComponentFields } from "../../vdp-sdk";

export function transformStartOperatorFieldsToZod(
  fields: Nullable<PipelineStartComponentFields>
) {
  let zodSchema: z.ZodObject<any, any, any> = z.object({});

  if (!fields) return zodSchema;

  for (const [key, value] of Object.entries(fields)) {
    switch (value.instill_format) {
      case "string":
        zodSchema = zodSchema.setKey(key, z.string().nullable().optional());
        break;
      case "array:string":
        zodSchema = zodSchema.setKey(
          key,
          z.array(z.string().nullable().optional()).nullable().optional()
        );
        break;
      case "boolean":
        zodSchema = zodSchema.setKey(key, z.boolean().nullable().optional());
        break;
      case "number":
        zodSchema = zodSchema.setKey(
          key,
          z.coerce.number().nullable().optional()
        );
        break;
      case "array:number":
        zodSchema = zodSchema.setKey(
          key,
          z.array(z.coerce.number().nullable().optional()).nullable().optional()
        );
        break;
      case "audio/*":
        zodSchema = zodSchema.setKey(key, z.string().nullable().optional());
        break;
      case "array:audio/*":
        zodSchema = zodSchema.setKey(
          key,
          z.array(z.string()).nullable().optional()
        );
        break;
      case "image/*":
        zodSchema = zodSchema.setKey(key, z.string().nullable().optional());
        break;
      case "array:image/*":
        zodSchema = zodSchema.setKey(
          key,
          z.array(z.string()).nullable().optional()
        );
        break;
      case "video/*":
        zodSchema = zodSchema.setKey(key, z.string().nullable().optional());
        break;
      case "array:video/*":
        zodSchema = zodSchema.setKey(
          key,
          z.array(z.string()).nullable().optional()
        );
        break;
      case "*/*":
        zodSchema = zodSchema.setKey(key, z.string().nullable().optional());
        break;
      case "array:*/*":
        zodSchema = zodSchema.setKey(
          key,
          z.array(z.string()).nullable().optional()
        );
        break;
      case "semi-structured/json":
        zodSchema = zodSchema.setKey(key, z.string().nullable().optional());
        break;
      default:
        break;
    }
  }

  return zodSchema;
}
