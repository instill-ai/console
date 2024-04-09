"use client";

import * as React from "react";
import { ComplicateIcons, Icons } from "@instill-ai/design-system";
import { PipelineStartComponentField } from "../../../../../lib";

export type StartOperatorInputField = {
  title: string;
  instill_format: string;
  icon: React.ReactNode;
  order: number;
  getFieldConfiguration: (
    title: string,
    description?: string
  ) => PipelineStartComponentField;
};

export const StartComponentFields: Record<string, StartOperatorInputField> = {
  string: {
    title: "Short Text",
    instill_format: "string",
    order: 0,
    getFieldConfiguration: (title, description) => ({
      instill_format: "string",
      title,
      description,
    }),
    icon: (
      <Icons.Type02 className="m-auto h-4 w-4 stroke-semantic-fg-primary" />
    ),
  },
  "array:string": {
    title: "Multiple Texts",
    instill_format: "array:string",
    order: 1,
    getFieldConfiguration: (title, description) => ({
      instill_format: "array:string",
      title,
      description,
    }),
    icon: (
      <Icons.TypePlus className="m-auto h-4 w-4 stroke-semantic-fg-primary" />
    ),
  },
  long_string: {
    title: "Long Text",
    instill_format: "string",
    order: 2,
    getFieldConfiguration: (title, description) => ({
      instill_format: "string",
      title,
      description,
      instill_ui_multiline: true,
    }),
    icon: (
      <Icons.AlighLeft className="m-auto h-4 w-4 stroke-semantic-fg-primary" />
    ),
  },
  number: {
    title: "Number",
    instill_format: "number",
    order: 3,
    getFieldConfiguration: (title, description) => ({
      instill_format: "number",
      title,
      description,
    }),
    icon: (
      <ComplicateIcons.Number
        fillAreaColor="fill-semantic-fg-primary"
        className="m-auto h-4 w-4"
      />
    ),
  },
  "image/*": {
    title: "Image",
    instill_format: "image/*",
    order: 4,
    getFieldConfiguration: (title, description) => ({
      instill_format: "image/*",
      title,
      description,
    }),
    icon: (
      <Icons.Image01 className="m-auto h-4 w-4 stroke-semantic-fg-primary" />
    ),
  },
  "array:image/*": {
    title: "Multiple Images",
    instill_format: "array:image/*",
    order: 5,
    getFieldConfiguration: (title, description) => ({
      instill_format: "array:image/*",
      title,
      description,
    }),
    icon: (
      <Icons.ImagePlus className="m-auto h-4 w-4 stroke-semantic-fg-primary" />
    ),
  },
  "audio/*": {
    title: "Audio",
    instill_format: "audio/*",
    order: 6,
    getFieldConfiguration: (title, description) => ({
      instill_format: "audio/*",
      title,
      description,
    }),
    icon: (
      <Icons.Recording04 className="m-auto h-4 w-4 stroke-semantic-fg-primary" />
    ),
  },
  "array:audio/*": {
    title: "Multiple Audios",
    instill_format: "array:audio/*",
    order: 7,
    getFieldConfiguration: (title, description) => ({
      instill_format: "array:audio/*",
      title,
      description,
    }),
    icon: (
      <Icons.Recording05 className="m-auto h-4 w-4 stroke-semantic-fg-primary" />
    ),
  },
  "*/*": {
    title: "File",
    instill_format: "*/*",
    order: 8,
    getFieldConfiguration: (title, description) => ({
      instill_format: "*/*",
      title,
      description,
    }),
    icon: (
      <Icons.FilePlus02 className="m-auto h-4 w-4 stroke-semantic-fg-primary" />
    ),
  },
  "array:*/*": {
    title: "Multiple Files",
    instill_format: "array:*/*",
    order: 9,
    getFieldConfiguration: (title, description) => ({
      instill_format: "array:*/*",
      title,
      description,
    }),
    icon: (
      <Icons.BracketSlash className="m-auto h-4 w-4 stroke-semantic-fg-primary" />
    ),
  },
  "video/*": {
    title: "Video",
    instill_format: "video/*",
    order: 10,
    getFieldConfiguration: (title, description) => ({
      instill_format: "audio/*",
      title,
      description,
    }),
    icon: <Icons.Video className="m-auto h-4 w-4 stroke-semantic-fg-primary" />,
  },
  "array:video/*": {
    title: "Multiple Videos",
    instill_format: "array:video/*",
    order: 11,
    getFieldConfiguration: (title, description) => ({
      instill_format: "array:video/*",
      title,
      description,
    }),
    icon: (
      <Icons.MultipleVideo className="m-auto h-4 w-4 stroke-semantic-fg-primary" />
    ),
  },
  boolean: {
    title: "Boolean",
    instill_format: "boolean",
    order: 12,
    getFieldConfiguration: (title, description) => ({
      instill_format: "boolean",
      title,
      description,
    }),
    icon: (
      <ComplicateIcons.ToggleLeft
        fillAreaColor="fill-semantic-fg-primary"
        className="m-auto h-4 w-4"
      />
    ),
  },

  // This is the special case. We use this input to store arbitrary JSON
  // By protocol, it don't have a type
  "semi-structured/json": {
    title: "JSON",
    instill_format: "semi-structured/json",
    order: 13,
    getFieldConfiguration: (title, description) => ({
      instill_format: "semi-structured/json",
      title,
      description,
    }),
    icon: (
      <Icons.BracketSlash className="m-auto h-4 w-4 stroke-semantic-fg-primary" />
    ),
  },
};
