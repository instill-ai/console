export function getImageTypeFromBase64String(base64String: string) {
  const imageFormats = {
    jpeg: "/9j",
    png: "iVB",
  };

  const header = base64String.substring(0, 3);

  for (const [key, value] of Object.entries(imageFormats)) {
    if (header === value) {
      return key;
    }
  }

  return "jpeg";
}
