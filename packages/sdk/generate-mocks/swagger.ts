/**
 * Credit: https://github.com/zoubingwu/msw-auto-mock
 */

import type { OpenAPIV3 } from "openapi-types";
import SwaggerParser from "@apidevtools/swagger-parser";
// @ts-ignore lack of d.ts file
import converter from "swagger2openapi";

export async function getV3Doc(spec: string): Promise<OpenAPIV3.Document> {
  const doc = await SwaggerParser.bundle(spec);
  const isOpenApiV3 = "openapi" in doc && doc.openapi.startsWith("3");
  if (isOpenApiV3) {
    return doc as OpenAPIV3.Document;
  } else {
    const result = await converter.convertObj(doc, {});
    return result.openapi as OpenAPIV3.Document;
  }
}
