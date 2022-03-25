import "../src/styles/global.css"
//import "tailwindcss/tailwind.css"
import * as NextImage from "next/image";
import { RouterContext } from "next/dist/shared/lib/router-context";

// issue: https://github.com/vercel/next.js/issues/18393
const OriginalNextImage = NextImage.default;
Object.defineProperty(NextImage, "default", {
  configurable: true,
  value: (props) => <OriginalNextImage {...props} unoptimized />,
});

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
	// To solve router.isReady is not defined issue
  nextRouter: {
    isReady: true,
    Provider: RouterContext.Provider,
  },
};