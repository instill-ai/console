import { isPipelineIteratorComponent } from "./checkComponentType";
import { PipelineComponent } from "../../../lib";

export function getAllComponentID(components: PipelineComponent[]): string[] {
  const nodeIDs: string[] = [];

  for (const component of components) {
    if (isPipelineIteratorComponent(component)) {
      nodeIDs.push(component.id);
      nodeIDs.push(...getAllComponentID(component.component));
      continue;
    }

    nodeIDs.push(component.id);
  }

  return nodeIDs;
}
