import { createNodesFromComponent } from "./createNodesFromComponent";
import { createNodesFromOutput } from "./createNodesFromOutput";
import { createNodesFromRunOnEvent } from "./createNodesFromRunOnEvent";
import { createNodesFromVariable } from "./createNodesFromVariable";
import { createStartNode } from "./createStartNode";

export const nodeHelpers = {
  createStartNode,
  createNodesFromComponent,
  createNodesFromOutput,
  createNodesFromRunOnEvent,
  createNodesFromVariable,
};
