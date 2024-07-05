export function getCaptializeTwoWordsFromName(name: string) {
  if (name.includes(" ")) {
    const [first, second] = name.split(" ");
    return `${first?.charAt(0).toUpperCase()}${second?.charAt(0).toUpperCase()}`;
  }

  return `${name.charAt(0).toUpperCase()}${name.charAt(1).toUpperCase()}`;
}
