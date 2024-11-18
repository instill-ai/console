export function isDownloadableArtifactBlob(value: string): boolean {
  return value.includes("blob-urls") && value.includes("namespaces");
}
