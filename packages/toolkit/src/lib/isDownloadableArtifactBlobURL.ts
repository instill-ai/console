export function isDownloadableArtifactBlobURL(url: string): boolean {
  return url.includes("blob-urls") && url.includes("namespaces");
}
