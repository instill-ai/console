export function generateNewNodeIdx(
	nodeIDs: string[],
	initialPrefix: "ai" | "blockchain" | "data" | "op"
) {
	const prefix = `${initialPrefix}_`;
	let nodeIdx = 0;
	const idxs: number[] = [];

	nodeIDs.forEach((id) => {
		if (id.startsWith(prefix)) {
			const idx = parseInt(id.replace(prefix, ""));
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
