
## Preface

Normally, what big company does not necessarily mean it will fit into a small and agile startup. Design tokens are not in that category and it will benefit our developer cycle in the long run. Let’s bring some examples here

- Color, we are using lots of color on our website and console. These colors usually are represented with hex values like #FFFFFF. This hex value doesn’t have any explicit meaning and is hard to remember. But with design-tokens, we can transfer them into something more verbose like primary, secondary…etc
- Light and Dark theme: Under the context of TailwindCSS, the way to implement the light/dark theme is normally with the help of a special utility class like bg-white dark:bg-black and when we switch the className at the root element from “” to “dark” the style will change. But this will cost us to set up all these color pairs again and again. Which makes sense when the project is small but not efficient when the project begins to grow. Right now we are using CSS variables and TailwindCSS together to accomplish this. (We can accomplish this without the help of Design-Tokens, but design-tokens bring us a much more stable platform to work with. So Dani Sosa and I take this opportunity) Later on, all we need to do is switch the data-theme at the root with a single color utility class set to enable dark mode
- Style tracing and versioning: The design-tokens are stored in our Github repo and version controlled.

There are lots of other minor goodies like

- Fast typography setup
- GitHub CI/CD for testing style conflict
- Additional abstraction to encapsulate styles

## Package structure

## How it works

We have the tokens studio plugin installed in our Figma editor. Whenever designers have a new set of tokens, they can use the sync functionality to push new tokens to this GitHub repo and create a new PR based on the branch.

Once the PR is merged the Github action will be triggered and generate the new tokens file. The new tokens file will be published to the npm registry and can be used by other packages.

## How to use

Install this package.

```bash
pnpm add @instill-ai/design-tokens
```

This package will export a /dist folder and contains the following files:

```
├── dist
│   ├── semantic
│   │   └── sd-tokens.ts <-- Normally you won't have a chance to use this file
│   ├── tailwind.config.cjs <-- The tailwind preset file
│   └── theme
│       ├── dark.css <-- The dark theme CSS variables file
│       ├── light.css <-- The light theme CSS variables file
│       └── root.css <-- The root CSS variables file
```

You need to digest the whole TailwindCSS configuration preset like below and set the rest configuration you need. (If you are building the Instill-AI's product we are not recommended to add extra style besides this preset. If the style is lacking please file the issue in the repo)

```js
module.exports = {
  presets: [require("@instill-ai/design-tokens/dist/tailwind.config.cjs")],
  content: [
    "src/**/*.{js,ts,jsx,tsx}",
  ],
}
```

Then you can import the CSS variables file in your project at the root of the app

```ts
// pages/_app.tsx
import "@instill-ai/design-tokens/dist/theme/root.css";
import "@instill-ai/design-tokens/dist/theme/light.css";
import "@instill-ai/design-tokens/dist/theme/dark.css";

// app/layout.tsx
import "@instill-ai/design-tokens/dist/theme/root.css";
import "@instill-ai/design-tokens/dist/theme/light.css";
import "@instill-ai/design-tokens/dist/theme/dark.css";
```

Don't forget to import the base style of TailwindCSS [^2]

## How to switch theme

Initialize the user preference at the root of the app

```ts
// pages/_app.tsx
useLayoutEffect(() => {
  const currentTheme = localStorage.getItem("instill-console-theme")
    ? localStorage.getItem("instill-console-theme")
    : null;

  if (currentTheme) {
    document.documentElement.setAttribute("data-theme", currentTheme);
  }
}, []);
```

Toggle the theme in the app

```tsx
<button
  className="font-sans text-semantic-fg-primary"
  onClick={() => {
    const currentTheme = localStorage.getItem("instill-console-theme")
      ? localStorage.getItem("instill-console-theme")
      : null;

    if (currentTheme === "dark") {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("instill-console-theme", "light");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("instill-console-theme", "dark");
    }
  }}
>
  Theme switch
</button>
```

## How to set up the font 

Import the Google font in the Head

```html
<head>
  <link
    rel="preconnect"
    href="https://fonts.googleapis.com"
    as="font"
    crossOrigin=""
  />
  <link
    href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap"
    rel="stylesheet"
  />
</head>
```

Set up the CSS variables

```
:root {
  --font-ibm-plex-sans: "IBM Plex Sans", sans-serif;
}
```



## How to use the font with Nextjs optimization

You need to first check all the CSS variables related to FontFamily in the TailwindCSS preset, and add the CSS variable at the root of your Nextjs APP. Take IBM Plex Sans as an example. The TailwindCSS preset looks like

```js
module.exports = {
  theme: {
    fontFamily: {
      "ibm-plex-sans": "var(--font-ibm-plex-sans)"
    },
  }
}
```

You need to set the font optimization according to the identifier `--font-ibm-plex-sans`

```ts
// pages/_app.tsx
import { IBM_Plex_Sans } from "next/font/google";
import { Inter } from 'next/font/google';
 
const ibmPlexSans = IBM_Plex_Sans({
  style: ["italic", "normal"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: '--font-ibm-plex-sans',
});
 
export default function MyApp({ Component, pageProps }) {
  return (
    <main className={`${inter.variable} font-sans`}>
      <Component {...pageProps} />
    </main>
  );
}
```

## Technological details 

### The Tokens Studio's token

The tokens that come from Token Studio's plugin will be stored in the /tokens folder and committed into git. (The plugin will treat this repo as remote storage. So it's forbidden to directly change the tokens stored in this folder)

The structure will look like this. 

- `global.json`: This file has all the styles a designer needs to construct a proper design-tokens. Right now the owner is our designer Dani.
- `/semantic`: This folder stores the base of the design tokens. We will construct the base TailwindCSS preset from this file
- `/theme`: This folder stores the theme-related tokens. We will construct the theme CSS variables from this file

```
├── tokens
│   ├── $metadata.json
│   ├── $themes.json
│   ├── global.json
│   ├── semantic
│   │   ├── colour.json
│   │   ├── comp.json
│   │   └── typography.json
│   └── theme
│       ├── dark.json
│       └── light.json
```

### The flow

![design-tokens-flow](https://github.com/instill-ai/design-system/assets/57251712/98728c68-0288-453d-9abb-dd11fbfb2ea0)

- Build `sd-tokens` (`./src/buildSDTokens.ts`)
  - Merge `global.json`, `/semantic/*.json`
  - Make every inherited style get what they need
  - Filter out the tokens which have filePath=global.json to remove the base style in the style dictionary tokens.
  - Transform the style dictionary tokens to full tokens list and store them in the `/dist/semantic/sd-tokens.ts` file
- Build `/theme` CSS variables (`./src/buildCSSVariables.ts`)
  - Merge `global.json`, `/theme/*.json`
  - Make every inherited style get what they need
  - Filter out the tokens which have filePath=global.json to remove the base style in the style dictionary tokens.
  - Transform the style dictionary tokens to CSS variables and store them in the `/dist/theme` folder
- Use the `/dist/semantic/sd-tokens.ts` to build the TailwindCSS preset (`./src/buildTailwindPreset`)

### One-to-one mapping

Currently, we are not greedy in transforming all the styles we get from the tokens but only transform a part of it. Here is the style we transform right now.

- color
- boxShadow
- typography
- borderWidth
- opacity
- borderRadius
- spacing
- fontFamilies

If you find out these styles are not enough. Please file issue in this repo.

### Naming agnostic

We are trying to not affect the naming convention of designers by emitting additional naming rules. So we do a lot of naming transformation under the hood. 

Takes fontFamily for example, the tokens that come from the plugin look like

```json
{
  "fontFamilies": {
  "ibm-plex-sans": {
    "value": "IBM Plex Sans",
    "type": "fontFamilies"
  }
},
}
```

The style dictionary will transform it to this and you will notice that it constructs the name to kebab-case. This is due to we are using Style Dictionary pre-defined transforms. `attribute/cti` [^3] will add an attribute object based on the location of the token and `name/cti/kebab`[^4] will create a kebab case name based on the attribute object.

```json
{
  value: "IBM Plex Sans",
  type: "fontFamilies",
  filePath: "tokens/semantic/typography.json",
  isSource: true,
  original: { value: "IBM Plex Sans", type: "fontFamilies" },
  name: "font-families-ibm-plex-sans",
  attributes: { category: "font-families", type: "ibm-plex-sans" },
  path: ["font-families", "ibm-plex-sans"],
}
```

But this will make our tailwind class `font-font-families-ibm-plex-sans`, it's too verbose and increases the bundle size of the CSS files. So we will transform it to `ibm-plex-sans` in the TailwindCSS preset.

```ts
const fontFamilies = tokens.filter((e) => e.type === "fontFamilies");
const fontFamiliesString = fontFamilies
  .map((e) => `"${e.name.replace("font-families-", "")}": "${e.value}"`)
  .join(",\n");

const configuration = `module.exports = {
  theme: {
    fontFamily: {${fontFamiliesString}},
  },
}`;
```

Due to this act, the designer can choose whatever they want to name for the tokens, but they need to stick consistently across different versions.

### How do we achieve the theme switch using CSS variables?

As mentioned by above section , we can switch between dark and light theme by switching the root's data-theme value. This is done by two layer of design.

1. We set the TailwindCSS configuration preset with CSS variable. It will looks like below.

```js
module.exports = {
  theme: {
    colors: {
      "semantic-bg-primary": "var(--semantic-bg-primary)",
    }
  }
}
```

2. We construct the css variable and import them at the root. The css file will looks like below

```css
:root {
  --semantic-bg-primary: #ffffff;
}

[data-theme="light"] {
  --semantic-bg-primary: #ffffff;
}

[data-theme="dark"] {
  --semantic-bg-primary: #23272f;
}
```

So when you switch the `data-theme` value, the `--semantic-bg-primary` will also change. Which makes the theme switch possible.

## Caveats

### TextCase and TextTransformation

When it comes to the uppercase and lowercase, Tokens Studio is using `textCase` as identifier but css is using `textTransformation`. We need to transform this identifier.

### FontWeight and FontStyle

There has no fontStyle property in Figma so Tokens Studio embraces this idea [^5]. So the token its return will have something like

```js
{
  value: {
    fontFamily: "IBM Plex Sans",
    fontWeight: "Italic",
    lineHeight: "28px",
    fontSize: "18px",
    letterSpacing: "0%",
    paragraphSpacing: "0px",
    paragraphIndent: "0px",
    textCase: "none",
    textDecoration: "none",
  }
}
```

We need to do the transformation ourselves.

### `paragraphSpacing` and `paragraphIndent` is not a valid CSS property

Figma use `paragraphSpacing`[^6] and `paragraphIndent` internally and it's not a valid CSS property.

At this stage we will remove the `paragraphSpacing` and transform the `paragraphIndent` to `textIndent` in CSS.

### `letterSpacing` is represented as percentage in Figma

Figma is a platform agonistic design tool, it's not only for web. So the `letterSpacing` is represented as percentage[^8] in Figma. We need to transform it to `em` in CSS.

The letterSpacing in the Tokens Studio output may be inconsistent. But currently, besides from the typography, we will not use them. So we will not bother about its naming rules. But directly transform the value.

### How float is handling in Tokens Studio

Be careful, due to Tokens Studio is using . as a separator for it's object's path, we can not use `0.5` but `0,5` to represent the float value. The transform we have right now can handle them correctly. But do look close to this potential issue.

## Reference 

[^1]: [W3C Design Tokens Technical Reports](https://tr.designtokens.org/)
[^2]: [TailwindCSS - Installation](https://tailwindcss.com/docs/installation)
[^3]: [Style Dictionary - attribute/cti](https://amzn.github.io/style-dictionary/#/transforms?id=attributecti)
[^4]: [Style Dictionary - name/cti/kebab](https://amzn.github.io/style-dictionary/#/transforms?id=namectikebab)
[^5]: [Issue - Italic font style on typography](https://github.com/tokens-studio/figma-plugin/issues/1639)
[^6]: [Figma - Paragraph spacing](https://help.figma.com/hc/en-us/articles/360039956634-Explore-text-properties#paragraph-spacing)
[^7]: [Figma - Paragraph indent](https://help.figma.com/hc/en-us/articles/360039956634-Explore-text-properties#paragraph-indentation)
[^8]: [Figma - Letter spacing](https://help.figma.com/hc/en-us/articles/360039956634-Explore-text-properties#letter-spacing)