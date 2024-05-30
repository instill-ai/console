/**
 * The error location looks something like this
 * component.stability_0.input.prompts
 *
 * The first part of the location is the identifier, it might be
 * component, variable, on or output. (Corresponding to out recipe
 * design). The second part is the identifier under the first part.
 * Take this component as example, it means the component's id.
 * The third part is the form path.
 */

export function extractComponentFormPathFromErrorLocation(location: string) {
  const locationArray = location.split(".");

  if (locationArray[0] === "component") {
    return locationArray.slice(2).join(".");
  }

  return null;
}
