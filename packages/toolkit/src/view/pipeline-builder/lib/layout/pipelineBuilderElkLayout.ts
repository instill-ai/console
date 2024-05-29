import ELK from "elkjs/lib/elk.bundled.js";

export const pipelineBuilderElkLayout = new ELK({
  defaultLayoutOptions: {
    "elk.algorithm": "layered",
    "elk.direction": "RIGHT",

    /**
     * The minimal distance to be preserved between each two nodes.
     */
    "spacing.nodeNode": "50",

    /**
     * Spacing to be preserved between nodes and edges.
     */
    "spacing.edgeNode": "50",

    /**
     * Spacing to be preserved between any two edges. Note that while
     * this can somewhat easily be satisfied for the segments of orthogonally
     * drawn edges, it is harder for general polylines or splines.
     */
    "spacing.edgeEdge": "100",

    /**
     * Spacing to be preserved between pairs of edges that are routed between
     * the same pair of layers. Note that ‘spacing.edgeEdge’ is used for the
     * spacing between pairs of edges crossing the same layer.
     */
    "spacing.edgeEdgeBetweenLayers": "50",

    /**
     * The spacing to be preserved between nodes and edges that are routed
     * next to the node’s layer. For the spacing between nodes and edges
     * that cross the node’s layer ‘spacing.edgeNode’ is used.
     */
    "spacing.edgeNodeBetweenLayers": "50",

    /**
     * Spacing to be preserved between pairs of connected components.
     * This option is only relevant if ‘separateConnectedComponents’ is activated.
     */
    "spacing.componentComponent": "100",

    /**
     * The spacing to be preserved between any pair of nodes of two adjacent layers.
     * Note that ‘spacing.nodeNode’ is used for the spacing between nodes within the layer itself.
     */
    "spacing.nodeNodeBetweenLayers": "100",
  },
});
