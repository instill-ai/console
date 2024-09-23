import type { GeneralRecord, Nullable, PipelineRecipe } from "instill-sdk";
import type { Edge, Node } from "reactflow";

import type { NodeData } from "../../flow/types";
import { edgeHelpers } from "./edgeHelpers";
import { nodeHelpers } from "./nodeHelpers";

export class PipelineFlowFactory {
  recipe: Nullable<PipelineRecipe>;
  nodes: Node<NodeData>[] = [];
  edges: Edge[] = [];

  constructor(recipe: PipelineRecipe, metadata?: GeneralRecord) {
    this.recipe = recipe;
    this.nodes = this.composeNodes(recipe, metadata);
    this.edges = this.composeEdges(recipe);
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

  composeNodes(recipe: PipelineRecipe, metadata?: GeneralRecord) {
    const nodes: Node<NodeData>[] = [];

    if (recipe && recipe.component) {
      const componentNodes = nodeHelpers.createNodesFromComponent(
        recipe.component,
        metadata,
      );
      nodes.push(...componentNodes);
    }

    if (recipe && recipe.on && recipe.on.event) {
      const runOnEventNodes = nodeHelpers.createNodesFromRunOnEvent(
        recipe.on.event,
        metadata,
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

  composeEdges(recipe: PipelineRecipe) {
    const edges: Edge[] = [];

    const userDefinedReferences =
      edgeHelpers.getUserDefinedReferencesFromRecipe(recipe);

    console.log("userDefinedReferences", userDefinedReferences);

    const {
      variableNodeConnectableReferencePaths,
      componentNodeConnectableReferencePaths,
    } = edgeHelpers.getConnectableReferencePathsFromRecipe(recipe);

    for (const reference of userDefinedReferences) {
      const newEdges = edgeHelpers.composeEdgesForReference({
        reference,
        variableNodeConnectableReferencePaths,
        componentNodeConnectableReferencePaths,
        currentEdges: edges,
      });

      edges.push(...newEdges);
    }

    return edges;
  }
}
