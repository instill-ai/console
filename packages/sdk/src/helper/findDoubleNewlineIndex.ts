export function findDoubleNewlineIndex(buffer: Uint8Array): number {
  // This function searches the buffer for the end patterns (\r\r, \n\n, \r\n\r\n)
  // and returns the index right after the first occurrence of any pattern,
  // or -1 if none of the patterns are found.
  const newline = 0x0a; // \n
  const carriage = 0x0d; // \r

  for (let i = 0; i < buffer.length - 2; i++) {
    if (buffer[i] === newline && buffer[i + 1] === newline) {
      // \n\n
      return i + 2;
    }
    if (buffer[i] === carriage && buffer[i + 1] === carriage) {
      // \r\r
      return i + 2;
    }
    if (
      buffer[i] === carriage &&
      buffer[i + 1] === newline &&
      i + 3 < buffer.length &&
      buffer[i + 2] === carriage &&
      buffer[i + 3] === newline
    ) {
      // \r\n\r\n
      return i + 4;
    }
  }

  return -1;
}
