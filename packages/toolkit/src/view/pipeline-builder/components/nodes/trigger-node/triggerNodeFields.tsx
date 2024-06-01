"use client";

import * as React from "react";
import { ComplicateIcons, Icons } from "@instill-ai/design-system";
import { PipelineVariableField } from "../../../../../lib";

export type TriggerNodeInputField = {
  title: string;
  instillFormat: string;
  icon: React.ReactNode;
  order: number;
  getFieldConfiguration: (
    title: string,
    description?: string
  ) => PipelineVariableField;
};

export const triggerNodeFields: Record<string, TriggerNodeInputField> = {
  string: {
    title: "Short Text",
    instillFormat: "string",
    order: 0,
    getFieldConfiguration: (title, description) => ({
      instillFormat: "string",
      title,
      description,
    }),
    icon: (
      <Icons.Type02 className="m-auto h-4 w-4 stroke-semantic-fg-primary" />
    ),
  },
  "array:string": {
    title: "Multiple Texts",
    instillFormat: "array:string",
    order: 1,
    getFieldConfiguration: (title, description) => ({
      instillFormat: "array:string",
      title,
      description,
    }),
    icon: (
      <Icons.TypePlus className="m-auto h-4 w-4 stroke-semantic-fg-primary" />
    ),
  },
  long_string: {
    title: "Long Text",
    instillFormat: "string",
    order: 2,
    getFieldConfiguration: (title, description) => ({
      instillFormat: "string",
      title,
      description,
      instillUiMultiline: true,
    }),
    icon: (
      <Icons.AlighLeft className="m-auto h-4 w-4 stroke-semantic-fg-primary" />
    ),
  },
  number: {
    title: "Number",
    instillFormat: "number",
    order: 3,
    getFieldConfiguration: (title, description) => ({
      instillFormat: "number",
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
    instillFormat: "image/*",
    order: 4,
    getFieldConfiguration: (title, description) => ({
      instillFormat: "image/*",
      title,
      description,
    }),
    icon: (
      <Icons.Image01 className="m-auto h-4 w-4 stroke-semantic-fg-primary" />
    ),
  },
  "array:image/*": {
    title: "Multiple Images",
    instillFormat: "array:image/*",
    order: 5,
    getFieldConfiguration: (title, description) => ({
      instillFormat: "array:image/*",
      title,
      description,
    }),
    icon: (
      <Icons.ImagePlus className="m-auto h-4 w-4 stroke-semantic-fg-primary" />
    ),
  },
  "audio/*": {
    title: "Audio",
    instillFormat: "audio/*",
    order: 6,
    getFieldConfiguration: (title, description) => ({
      instillFormat: "audio/*",
      title,
      description,
    }),
    icon: (
      <Icons.Recording04 className="m-auto h-4 w-4 stroke-semantic-fg-primary" />
    ),
  },
  "array:audio/*": {
    title: "Multiple Audios",
    instillFormat: "array:audio/*",
    order: 7,
    getFieldConfiguration: (title, description) => ({
      instillFormat: "array:audio/*",
      title,
      description,
    }),
    icon: (
      <Icons.Recording05 className="m-auto h-4 w-4 stroke-semantic-fg-primary" />
    ),
  },
  "*/*": {
    title: "File",
    instillFormat: "*/*",
    order: 8,
    getFieldConfiguration: (title, description) => ({
      instillFormat: "*/*",
      title,
      description,
    }),
    icon: (
      <Icons.FilePlus02 className="m-auto h-4 w-4 stroke-semantic-fg-primary" />
    ),
  },
  "array:*/*": {
    title: "Multiple Files",
    instillFormat: "array:*/*",
    order: 9,
    getFieldConfiguration: (title, description) => ({
      instillFormat: "array:*/*",
      title,
      description,
    }),
    icon: (
      <Icons.BracketSlash className="m-auto h-4 w-4 stroke-semantic-fg-primary" />
    ),
  },
  "video/*": {
    title: "Video",
    instillFormat: "video/*",
    order: 10,
    getFieldConfiguration: (title, description) => ({
      instillFormat: "video/*",
      title,
      description,
    }),
    icon: <Icons.Video className="m-auto h-4 w-4 stroke-semantic-fg-primary" />,
  },
  "array:video/*": {
    title: "Multiple Videos",
    instillFormat: "array:video/*",
    order: 11,
    getFieldConfiguration: (title, description) => ({
      instillFormat: "array:video/*",
      title,
      description,
    }),
    icon: (
      <Icons.MultipleVideo className="m-auto h-4 w-4 stroke-semantic-fg-primary" />
    ),
  },
  boolean: {
    title: "Boolean",
    instillFormat: "boolean",
    order: 12,
    getFieldConfiguration: (title, description) => ({
      instillFormat: "boolean",
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
    instillFormat: "semi-structured/json",
    order: 13,
    getFieldConfiguration: (title, description) => ({
      instillFormat: "semi-structured/json",
      title,
      description,
    }),
    icon: (
      <Icons.BracketSlash className="m-auto h-4 w-4 stroke-semantic-fg-primary" />
    ),
  },
};
