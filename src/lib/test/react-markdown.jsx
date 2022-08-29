/**
 * Because react-markdown is now a ESM package, Jest still need some config to test ESM packages.
 * This is just a workaround, if you want to test react-markdown you may need something else, you
 * could find more information here
 * - https://github.com/remarkjs/react-markdown/issues/635
 * - https://stackoverflow.com/questions/72382316/jest-encountered-an-unexpected-token-react-markdown
 */

/*eslint-disable */

import React from "react";

function ReactMarkdown({ children }) {
  return <>{children}</>;
}

export default ReactMarkdown;
