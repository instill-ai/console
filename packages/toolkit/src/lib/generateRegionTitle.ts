export function generateRegionTitle(regionName: string) {
  return regionName.slice(11).replaceAll('_', '-');
}