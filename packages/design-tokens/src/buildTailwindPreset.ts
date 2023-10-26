import { tokens } from "../dist/semantic/sd-tokens";
import fs from "fs/promises";
import path from "path";
import { TypographyValue } from "./type";

async function main() {
	const semanticColours = tokens.filter(
		(e) => e.type === "color" && e.filePath === "tokens/semantic/colour.json"
	);
	const semanticBoxShadow = tokens.filter(
		(e) => e.type === "boxShadow" && e.filePath === "tokens/semantic/comp.json"
	);

	const borderWidth = tokens.filter((e) => e.type === "borderWidth");
	const borderWitdhString = borderWidth
		.map((e) => `"${e.name.split("-")[2]}": "${e.value}"`)
		.join(",\n");

	const opacity = tokens.filter((e) => e.type === "opacity");
	const opacityString = opacity
		.map((e) => `"${e.name.split("-")[2]}": "${e.value}"`)
		.join(",\n");

	const spacing = tokens.filter((e) => e.type === "spacing");
	const spacingString = spacing
		.map((e) => `"${e.name.split("-")[2]}": "${e.value}"`)
		.join(",\n");

	const borderRadius = tokens.filter((e) => e.type === "borderRadius");
	const borderRadiusString = borderRadius
		.map((e) => `"${e.name.split("-")[1]}": "${e.value}"`)
		.join(",\n");

	// The name of the token will look like font-families-ibm-plex-sans and
	// we only need ibm-plex-sans

	const fontFamilies = tokens.filter((e) => e.type === "fontFamilies");
	const fontFamiliesString = fontFamilies
		.map(
			(e) =>
				`"${e.name.replace("font-families-", "")}": "var(--font-${(
					e.value as string
				)
					.replaceAll(" ", "-")
					.toLowerCase()})"`
		)
		.join(",\n");

	const typography = tokens.filter((e) => e.type === "typography");
	const typographyUtility = typography.map((e) => {
		const name = e.name;
		const value = e.value as TypographyValue;
		const textCase = value.textCase;
		const paragraphIndent = value.paragraphIndent;

		if (value.fontWeight === "Italic") {
			return `".${name}": ${JSON.stringify({
				...value,
				fontStyle: "italic",
				fontWeight: 400,
				textTransform: textCase,
				textCase: undefined,
				textIndent: paragraphIndent,
				paragraphIndent: undefined,
				paragraphSpacing: undefined,
				fontFamily: `var(--font-${value.fontFamily
					.replaceAll(" ", "-")
					.toLowerCase()})`,
			})}`;
		}

		if (value.fontWeight === "Medium Italic") {
			return `".${name}": ${JSON.stringify({
				...value,
				fontStyle: "italic",
				fontWeight: 500,
				textTransform: textCase,
				textCase: undefined,
				textIndent: paragraphIndent,
				paragraphIndent: undefined,
				paragraphSpacing: undefined,
				fontFamily: `var(--font-${value.fontFamily
					.replaceAll(" ", "-")
					.toLowerCase()})`,
			})}`;
		}

		if (value.fontWeight === "SemiBold Italic") {
			return `".${name}": ${JSON.stringify({
				...value,
				fontStyle: "italic",
				fontWeight: 600,
				textTransform: textCase,
				textCase: undefined,
				textIndent: paragraphIndent,
				paragraphIndent: undefined,
				paragraphSpacing: undefined,
				fontFamily: `var(--font-${value.fontFamily
					.replaceAll(" ", "-")
					.toLowerCase()})`,
			})}`;
		}

		if (value.fontWeight === "Bold Italic") {
			return `".${name}": ${JSON.stringify({
				...value,
				fontStyle: "italic",
				fontWeight: 700,
				textTransform: textCase,
				textCase: undefined,
				textIndent: paragraphIndent,
				paragraphIndent: undefined,
				paragraphSpacing: undefined,
				fontFamily: `var(--font-${value.fontFamily
					.replaceAll(" ", "-")
					.toLowerCase()})`,
			})}`;
		}

		if (value) {
			return `".${name}": ${JSON.stringify({
				...value,
				textTransform: textCase,
				textCase: undefined,
				textIndent: paragraphIndent,
				paragraphIndent: undefined,
				paragraphSpacing: undefined,
				fontFamily: `var(--font-${value.fontFamily
					.replaceAll(" ", "-")
					.toLowerCase()})`,
			})}`;
		}
	});

	const configuration = `
  const plugin = require('tailwindcss/plugin');

  module.exports = {
    theme: {
      extend: {
        colors: {
          ${semanticColours
						.map((e) => `"${e.name}": "var(--${e.name})"`)
						.join(",\n")}
        },
        boxShadow: {
          ${semanticBoxShadow
						.map((e) => `"${e.name.split("-")[1]}": "var(--${e.name})"`)
						.join(",\n")}
        },
        fontFamily: {${fontFamiliesString}},
        borderWidth: {${borderWitdhString}},
        opacity: {${opacityString}},
        spacing: {${spacingString}},
        borderRadius: {${borderRadiusString}}
      }
    },
    plugins: [
      ({ addUtilities }) => {
        addUtilities({${typographyUtility.join(",\n")}})
      },
      plugin(function ({ addVariant }) {
        addVariant('disabled-within', "&:has(input:is(:disabled),button:is(:disabled))")
      })
    ],
  }`;

	try {
		await fs.writeFile(path.resolve("dist/tailwind.config.cjs"), configuration);
	} catch (err) {
		console.log(err);
	}
}

main();
