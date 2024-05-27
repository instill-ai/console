import { Nullable, SuperRefineRule } from "../../type";
import { PipelineVariableFieldMap } from "../../vdp-sdk";

export function transformPipelineTriggerRequestFieldsToSuperRefineRules(
  fields: Nullable<PipelineVariableFieldMap>
) {
  const rules: SuperRefineRule[] = [];

  if (!fields) return rules;

  for (const [key, value] of Object.entries(fields)) {
    switch (value.instill_format) {
      case "string":
        rules.push({
          key,
          validator: (value) => {
            if (typeof value !== "string") {
              return {
                valid: false,
                error: `${key} must be a string`,
              };
            }

            return {
              valid: true,
            };
          },
        });
        break;
      case "array:string":
        rules.push({
          key,
          validator: (value) => {
            if (!Array.isArray(value)) {
              return {
                valid: false,
                error: `${key} must be an array`,
              };
            }

            return {
              valid: true,
            };
          },
        });
        break;
      case "boolean":
        rules.push({
          key,
          validator: (value) => {
            if (typeof value !== "boolean") {
              return {
                valid: false,
                error: `${key} must be a boolean`,
              };
            }

            return {
              valid: true,
            };
          },
        });
        break;
      case "number":
        rules.push({
          key,
          validator: (value) => {
            if (isNaN(Number(value))) {
              return {
                valid: false,
                error: `${key} must be a number`,
              };
            }

            return {
              valid: true,
            };
          },
        });
        break;
      case "array:number":
        rules.push({
          key,
          validator: (value) => {
            if (!Array.isArray(value)) {
              return {
                valid: false,
                error: `${key} must be an array`,
              };
            } else {
              for (const v of value) {
                if (isNaN(Number(v))) {
                  return {
                    valid: false,
                    error: `${key} must be an array of number`,
                  };
                }
              }
            }

            return {
              valid: true,
            };
          },
        });
        break;
      case "array:audio/*":
        rules.push({
          key,
          validator: (value) => {
            if (!Array.isArray(value)) {
              return {
                valid: false,
                error: `${key} must be an array`,
              };
            }
            return {
              valid: true,
            };
          },
        });
        break;
      case "array:image/*":
        rules.push({
          key,
          validator: (value) => {
            if (!Array.isArray(value)) {
              return {
                valid: false,
                error: `${key} must be an array`,
              };
            }

            return {
              valid: true,
            };
          },
        });
        break;
      case "array:*/*":
        rules.push({
          key,
          validator: (value) => {
            if (!Array.isArray(value)) {
              return {
                valid: false,
                error: `${key} must be an array`,
              };
            }

            return {
              valid: true,
            };
          },
        });
        break;
      default:
        break;
    }
  }

  return rules;
}
