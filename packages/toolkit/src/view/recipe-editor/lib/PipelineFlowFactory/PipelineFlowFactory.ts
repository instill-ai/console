import type { GeneralRecord, Nullable, PipelineRecipe } from "instill-sdk";
import type { Edge, Node } from "reactflow";

import type { NodeData } from "../../flow/types";
import { edgeHelpers } from "./edgeHelpers";
import { nodeHelpers } from "./nodeHelpers";

export class PipelineFlowFactory {
  recipe: Nullable<PipelineRecipe>;
  metadata: Nullable<GeneralRecord>;
  nodes: Node<NodeData>[] = [];
  edges: Edge[] = [];

  constructor(
    recipe: PipelineRecipe,
    metadata?: GeneralRecord,
    hideEventNodes?: boolean,
  ) {
    this.recipe = recipe;
    this.metadata = metadata ?? null;
    this.nodes = this.composeNodes(recipe, metadata, hideEventNodes);
    this.edges = this.composeEdges(recipe, hideEventNodes);
  }

  createFlow() {
    return {
      nodes: this.nodes,
      edges: this.edges,
    };
  }

  getRecipe() {
    return this.recipe;
  }

  composeNodes(
    recipe: PipelineRecipe,
    metadata?: GeneralRecord,
    hideEventNodes?: boolean,
  ) {
    const nodes: Node<NodeData>[] = [];

    // Add start node
    const startNode = nodeHelpers.createStartNode();
    nodes.push(startNode);

    if (recipe && recipe.component) {
      const componentNodes = nodeHelpers.createNodesFromComponent(
        recipe.component,
        metadata,
      );
      nodes.push(...componentNodes);
    }

    if (recipe && recipe.on) {
      const runOnEventNodes = nodeHelpers.createNodesFromRunOnEvent(
        recipe.on,
        metadata,
        hideEventNodes,
      );
      nodes.push(...runOnEventNodes);
    }

    if (recipe && recipe.variable) {
      const variableNodes = nodeHelpers.createNodesFromVariable(
        recipe.variable,
        metadata,
      );
      nodes.push(...variableNodes);
    }

    if (recipe && recipe.output) {
      const outputNodes = nodeHelpers.createNodesFromOutput(
        recipe.output,
        metadata,
      );
      nodes.push(...outputNodes);
    }

    return nodes;
  }

  composeEdges(recipe: PipelineRecipe, hideEventNodes?: boolean) {
    const edges: Edge[] = [];

    const userDefinedReferences =
      edgeHelpers.getUserDefinedReferencesFromRecipe(recipe);

    const {
      variableNodeConnectableReferencePaths,
      componentNodeConnectableReferencePaths,
      runOnNodeConnectableReferencePaths,
    } = edgeHelpers.getConnectableReferencePathsFromRecipe(recipe);

    for (const reference of userDefinedReferences) {
      const newEdges = edgeHelpers.composeEdgesForReference({
        reference,
        variableNodeConnectableReferencePaths,
        componentNodeConnectableReferencePaths,
        runOnNodeConnectableReferencePaths,
        currentEdges: edges,
      });

      edges.push(...newEdges);
    }

    // compose the edges for the run on event nodes
    if (recipe && recipe.on) {
      for (const [id] of Object.entries(recipe.on)) {
        let hasVariableConnectToRunOnEvent = false;

        if (recipe.variable) {
          for (const [, value] of Object.entries(recipe.variable)) {
            if (value && value.listen) {
              for (const listen of value.listen) {
                if (listen.includes(`on.${id}`)) {
                  hasVariableConnectToRunOnEvent = true;
                }
              }
            }
          }
        }

        if (!hasVariableConnectToRunOnEvent) {
          edges.push({
            id: `run-on-event-${id}`,
            source: id,
            target: "start",
            type: "eventErrorEdge",
            hidden: hideEventNodes,
          });
          continue;
        }

        edges.push({
          id: `run-on-event-${id}`,
          source: id,
          target: "start",
          type: "eventEdge",
          hidden: hideEventNodes,
        });
      }
    }

    return edges;
  }
}
