export function getImageTypeFromBase64String(base64String: string) {
  const imageFormats = {
    jpeg: "/9j",
    png: "iVB",
    webp: "UklGR",
  };

  for (const [key, value] of Object.entries(imageFormats)) {
    if (base64String.startsWith(value)) {
      return key;
    }
  }

  return "jpeg";
}
