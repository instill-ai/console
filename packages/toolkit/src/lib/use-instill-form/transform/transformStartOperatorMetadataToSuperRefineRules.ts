import { Nullable, SuperRefineRule } from "../../type";
import { StartOperatorMetadata } from "../../vdp-sdk";

export function transformStartOperatorMetadataToSuperRefineRules(
  metadata: Nullable<StartOperatorMetadata>
) {
  const rules: SuperRefineRule[] = [];

  if (!metadata) return rules;

  for (const [key, value] of Object.entries(metadata)) {
    switch (value.instillFormat) {
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
            if (!value)
              return {
                valid: false,
                error: `${key} cannot be empty`,
              };
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
            if (!value)
              return {
                valid: false,
                error: `${key} cannot be empty`,
              };
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
            if (!value)
              return {
                valid: false,
                error: `${key} cannot be empty`,
              };
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
            if (!value)
              return {
                valid: false,
                error: `${key} cannot be empty`,
              };
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
            if (!value)
              return {
                valid: false,
                error: `${key} cannot be empty`,
              };
            return {
              valid: true,
            };
          },
        });
        break;
      case "audio/*":
        rules.push({
          key,
          validator: (value) => {
            if (!value)
              return {
                valid: false,
                error: `${key} cannot be empty`,
              };
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
            if (!value)
              return {
                valid: false,
                error: `${key} cannot be empty`,
              };
            return {
              valid: true,
            };
          },
        });
        break;
      case "image/*":
        rules.push({
          key,
          validator: (value) => {
            if (!value)
              return {
                valid: false,
                error: `${key} cannot be empty`,
              };
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
            if (!value)
              return {
                valid: false,
                error: `${key} cannot be empty`,
              };
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
