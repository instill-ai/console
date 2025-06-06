/**
 * Credit: https://github.com/zoubingwu/msw-auto-mock
 */

import vm from "node:vm";
import { faker } from "@faker-js/faker";
import camelCase from "lodash/camelCase";
import merge from "lodash/merge";
import { OpenAPIV3 } from "openapi-types";

import { GenerateOptions } from "./types";

const MAX_STRING_LENGTH = 42;

export type ResponseMap = {
  code: string;
  id: string;
  responses?: Record<string, OpenAPIV3.SchemaObject>;
};

export type Operation = {
  verb: string;
  path: string;
  parameters: OpenAPIV3.ParameterObject[];
  response: ResponseMap[];
};

export type OperationCollection = Operation[];

export function getResIdentifierName(res: ResponseMap) {
  if (!res.id) {
    return "";
  }
  return camelCase(`get ${res.id}${res.code}Response`);
}

export function transformToGenerateResultFunctions(
  operationCollection: OperationCollection,
  baseURL: string,
  options?: GenerateOptions,
): string {
  const context = {
    faker,
    MAX_STRING_LENGTH,
    MAX_ARRAY_LENGTH: options?.maxArrayLength ?? 20,
    baseURL: baseURL ?? "",
    result: null,
  };
  vm.createContext(context);

  return operationCollection
    .map((op) =>
      op.response
        .map((r) => {
          const name = getResIdentifierName(r);
          if (!name) {
            return "";
          }

          const fakerResult = transformJSONSchemaToFakerCode(
            r.responses?.["application/json"],
          );
          if (options?.static) {
            vm.runInContext(`result = ${fakerResult};`, context);
          }

          return [
            `export function `,
            `${name}() { `,
            `return ${options?.static ? JSON.stringify(context.result) : fakerResult} `,
            `};\n`,
          ].join("\n");
        })
        .join("\n"),
    )
    .join("\n");
}

export function transformToHandlerCode(
  operationCollection: OperationCollection,
): string {
  return operationCollection
    .sort((a, b) => b.path.length - a.path.length)
    .map((op) => {
      const successResponse = op.response.find(
        (response) => response.code === "200",
      );

      if (!successResponse) {
        return "";
      }

      // Get query parameters from the OpenAPI definition
      const queryParams =
        op.parameters
          ?.filter((param) => param.in === "query")
          .map((param) => param.name) ?? [];

      const identifier = getResIdentifierName(successResponse);

      return `http.${op.verb}(\`\${baseURL}${op.path}\`, async ({ request }) => {
          try {
            const url = new URL(request.url);
            const paramKeys = Array.from(url.searchParams.keys())

            const unexpectedParams = [];
            const missingParams = [];

            for (const param of paramKeys) {
              if (!${JSON.stringify(queryParams)}.includes(param)) {
                unexpectedParams.push(param);
              }
            }

            for (const param of ${JSON.stringify(queryParams)}) {
              if (!paramKeys.includes(param)) {
                missingParams.push(param);
              }
            }

            const statusText = [];

            if (unexpectedParams.length > 0) {
              statusText.push(\`Unexpected query parameters: \${unexpectedParams.join(', ')}\`);
            }

            if (missingParams.length > 0) {
              statusText.push(\`Missing query parameters: \${missingParams.join(', ')}\`);
            }

            if (statusText.length > 0) {
              return new HttpResponse(null, {
                status: 400,
                statusText: statusText.join("; ")
              });
            }

            return HttpResponse.json(await ${identifier}())
          } catch(error){
            console.error(error)
            return new HttpResponse(null, {
              status: 500,
              statusText: "Internal Server Error"
            });
          }
        }),\n`;

      // The code below is for future reference
      // We have namespace path like /namespaces/*/pipelines/pid
      // For it we need to generate two route
      // - /users/*/pipelines/pid
      // - /organizations/*/pipelines/pid

      // const namespacesRegex = /namespaces/g;

      // if (namespacesRegex.test(op.path)) {
      //   const orgPath = op.path.replace(namespacesRegex, "organizations");
      //   const userPath = op.path.replace(namespacesRegex, "users");

      //   return `http.${op.verb}(\`\${baseURL}${orgPath}\`, async () => {
      //     return HttpResponse.json(await ${identifier}())
      //   }),\n
      //   http.${op.verb}(\`\${baseURL}${userPath}\`, async () => {
      //     return HttpResponse.json(await ${identifier}())
      //   }),\n`;
      // } else {
      //   return `http.${op.verb}(\`\${baseURL}${op.path}\`, async () => {
      //     return HttpResponse.json(await ${identifier}())
      //   }),\n`;
      // }
    })
    .join("  ")
    .trimEnd();
}

function transformJSONSchemaToFakerCode(
  jsonSchema?: OpenAPIV3.SchemaObject,
  key?: string,
): string {
  if (!jsonSchema) {
    return "null";
  }

  if (jsonSchema.example) {
    if (jsonSchema.example.$ref) {
    }
    return JSON.stringify(jsonSchema.example);
  }

  if (Array.isArray(jsonSchema.type)) {
    return `faker.helpers.arrayElement([${jsonSchema.type
      .map((type) => transformJSONSchemaToFakerCode({ ...jsonSchema, type }))
      .join(",")}])`;
  }

  if (jsonSchema.enum) {
    return `faker.helpers.arrayElement(${JSON.stringify(jsonSchema.enum)})`;
  }

  if (jsonSchema.allOf) {
    const { allOf, ...rest } = jsonSchema;
    return transformJSONSchemaToFakerCode(merge({}, ...allOf, rest));
  }

  if (jsonSchema.oneOf) {
    const schemas = jsonSchema.oneOf as OpenAPIV3.SchemaObject[];
    return `faker.helpers.arrayElement([${schemas.map((i) => transformJSONSchemaToFakerCode(i))}])`;
  }

  if (jsonSchema.anyOf) {
    const schemas = jsonSchema.anyOf as OpenAPIV3.SchemaObject[];
    return `faker.helpers.arrayElement([${schemas.map((i) => transformJSONSchemaToFakerCode(i))}])`;
  }

  switch (jsonSchema.type) {
    case "string":
      return transformStringBasedOnFormat(jsonSchema, key);
    case "number":
    case "integer":
      const params = JSON.stringify({
        min: jsonSchema.minimum,
        max: jsonSchema.maximum,
      });
      if (jsonSchema.minimum || jsonSchema.maxItems) {
        return `faker.number.int(${params})`;
      }
      return `faker.number.int()`;
    case "boolean":
      return `faker.datatype.boolean()`;
    case "object":
      if (
        !jsonSchema.properties &&
        typeof jsonSchema.additionalProperties === "object"
      ) {
        return `[...new Array(5).keys()].map(_ => ({ [faker.lorem.word()]: ${transformJSONSchemaToFakerCode(
          jsonSchema.additionalProperties as OpenAPIV3.SchemaObject,
        )} })).reduce((acc, next) => Object.assign(acc, next), {})`;
      }

      return `{
        ${Object.entries(jsonSchema.properties ?? {})
          .map(([k, v]) => {
            return `${JSON.stringify(k)}: ${transformJSONSchemaToFakerCode(v as OpenAPIV3.SchemaObject, k)}`;
          })
          .join(",\n")}
    }`;
    case "array":
      return `[...(new Array(faker.number.int({ min: ${jsonSchema.minItems ?? 1}, max: ${
        jsonSchema.maxItems ?? "MAX_ARRAY_LENGTH"
      } }))).keys()].map(_ => (${transformJSONSchemaToFakerCode(jsonSchema.items as OpenAPIV3.SchemaObject)}))`;
    default:
      return "null";
  }
}

/**
 * See https://json-schema.org/understanding-json-schema/reference/string.html#built-in-formats
 */
function transformStringBasedOnFormat(
  schema: OpenAPIV3.NonArraySchemaObject,
  key?: string,
) {
  const { format, minLength, maxLength } = schema;
  if (
    ["date-time", "date", "time"].includes(format ?? "") ||
    key?.toLowerCase().endsWith("_at")
  ) {
    return `faker.date.past()`;
  } else if (format === "uuid") {
    return `faker.string.uuid()`;
  } else if (
    ["idn-email", "email"].includes(format ?? "") ||
    key?.toLowerCase().endsWith("email")
  ) {
    return `faker.internet.email()`;
  } else if (["hostname", "idn-hostname"].includes(format ?? "")) {
    return `faker.internet.domainName()`;
  } else if (format === "ipv4") {
    return `faker.internet.ip()`;
  } else if (format === "ipv6") {
    return `faker.internet.ipv6()`;
  } else if (
    ["uri", "uri-reference", "iri", "iri-reference", "uri-template"].includes(
      format ?? "",
    ) ||
    key?.toLowerCase().includes("url")
  ) {
    if (
      ["photo", "image", "picture"].some((image) =>
        key?.toLowerCase().includes(image),
      )
    ) {
      return `faker.image.url()`;
    }
    return `faker.internet.url()`;
  } else if (key?.toLowerCase().endsWith("name")) {
    return `faker.person.fullName()`;
  } else {
    if (minLength && maxLength) {
      return `faker.string.alpha({ length: { min: ${minLength}, max: ${maxLength} }})`;
    } else if (minLength) {
      return `faker.string.alpha({ length: { min: ${minLength}, max: MAX_STRING_LENGTH }})`;
    } else if (maxLength) {
      return `faker.string.alpha({ length: { min: 0, max: ${maxLength} }})`;
    } else {
      return `faker.lorem.words().replaceAll(' ', "_")`;
    }
  }
}
