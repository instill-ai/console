/**
 * Check if the format is related to artifact, these format need to be uploaded to artifact
 * @param format - The format to check
 * @returns True if the format is related to artifact, false otherwise
 */
export function isArtifactRelatedInstillFormat(format?: string): boolean {
  return (
    format === "file" ||
    format === "array:file" ||
    format === "image" ||
    format === "array:image" ||
    format === "video" ||
    format === "array:video" ||
    format === "audio" ||
    format === "array:audio" ||
    format === "document"
  );
}
