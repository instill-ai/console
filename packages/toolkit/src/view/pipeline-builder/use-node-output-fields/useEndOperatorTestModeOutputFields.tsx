/* eslint-disable  @typescript-eslint/no-explicit-any */

import * as React from "react";
import { OpenAPIV3 } from "openapi-types";

import { TextField } from "./TextField";
import { TextsField } from "./TextsField";
import { ImageField } from "./ImageField";
import { ImagesField } from "./ImagesField";
import { NumberField } from "./NumberField";
import { NumbersField } from "./NumbersField";
import { Nullable, TriggerUserPipelineResponse, dot } from "../../../lib";
import {
	InstillAIOpenAPIProperty,
	getPropertiesFromOpenAPISchema,
} from "../lib";
import { getPipelineInputOutputSchema } from "../lib/getPipelineInputOutputSchema";
import { ObjectField } from "./ObjectField";
import { ObjectsField } from "./ObjectsField";

export function useEndOperatorTestModeOutputFields(
	openAPISchema: Nullable<OpenAPIV3.Document>,
	outputs: TriggerUserPipelineResponse["outputs"]
) {
	const fields = React.useMemo(() => {
		let outputProperties: InstillAIOpenAPIProperty[] = [];
		const fields: React.ReactElement[] = [];

		if (!openAPISchema) {
			return [];
		}

		const { outputSchema } = getPipelineInputOutputSchema(openAPISchema);

		if (outputSchema) {
			outputProperties = getPropertiesFromOpenAPISchema(outputSchema);
		}

		// This component will only be displayed under test mode, and under test
		// /view-only mode, we will display user defined title as title.

		for (const property of outputProperties) {
			let value: any = null;
			const title = property.title ? property.title : property.path ?? null;

			if (outputs[0]) {
				value = property.path ? dot.getter(outputs[0], property.path) : null;
			}

			switch (property.instillFormat) {
				case "text": {
					fields.push(<TextField nodeType="end" title={title} text={value} />);
					break;
				}
				case "text_array": {
					fields.push(
						<TextsField nodeType="end" title={title} texts={value} />
					);
					break;
				}
				case "image": {
					fields.push(
						<ImageField nodeType="end" title={title} image={value} />
					);
					break;
				}
				case "image_array": {
					fields.push(
						<ImagesField nodeType="end" title={title} images={value} />
					);
					break;
				}
				case "number": {
					fields.push(
						<NumberField nodeType="end" title={title} number={value} />
					);
					break;
				}
				case "number_array": {
					fields.push(
						<NumbersField nodeType="end" title={title} numbers={value} />
					);
					break;
				}
				case "object": {
					fields.push(
						<ObjectField nodeType="end" title={title} object={value} />
					);
					break;
				}
				case "object_array": {
					fields.push(
						<ObjectsField nodeType="end" title={title} objects={value} />
					);
					break;
				}
			}
		}

		return fields;
	}, [openAPISchema, outputs]);

	return fields;
}
