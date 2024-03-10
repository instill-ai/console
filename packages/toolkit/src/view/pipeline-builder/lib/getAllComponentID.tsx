import { isIteratorComponent } from "./checkComponentType";
import { PipelineComponent } from "../../../lib";

export function getAllComponentID(components: PipelineComponent[]): string[] {
  const nodeIDs: string[] = [];

  for (const component of components) {
    if (isIteratorComponent(component)) {
      nodeIDs.push(component.id);
      nodeIDs.push(
        ...getAllComponentID(component.iterator_component.components)
      );
      continue;
    }

    nodeIDs.push(component.id);
  }

  return nodeIDs;
}
