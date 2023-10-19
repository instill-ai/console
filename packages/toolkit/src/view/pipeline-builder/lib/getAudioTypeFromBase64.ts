export function getAudioTypeFromBase64(base64String: string) {
  const audioFormats = {
    mp3: "SUQzB",
    ogg: "T2dnUw", // OGG (base64-encoded)
  };

  const riggGroup = {
    wav: "XQVZF",
    webp: "XRUJQ",
    avi: "BVkkg",
  };

  for (const [key, value] of Object.entries(audioFormats)) {
    if (base64String.startsWith("UklGR")) {
      for (const [key, value] of Object.entries(riggGroup)) {
        const followingString = base64String.substring(11);
        if (followingString.startsWith(value)) {
          return key;
        }
      }
    }

    if (base64String.startsWith(value)) {
      return key;
    }
  }

  return "mpeg";
}
