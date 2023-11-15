export function generateNewComponentIndex(
  componentIDs: string[],
  initialPrefix: string
) {
  const prefix = `${initialPrefix}_`;
  let nodeIdx = 0;
  const idxs: number[] = [];

  componentIDs.forEach((id) => {
    if (id.startsWith(prefix)) {
      const idx = +id.replace(prefix, "");
      idxs.push(idx);
    }
  });

  idxs.sort((a, b) => a - b);

  for (const idx of idxs) {
    if (idx === nodeIdx) nodeIdx++;
    else break;
  }

  return nodeIdx;
}
