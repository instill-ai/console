import StyleDictionaryPackage from "style-dictionary";

function main() {
	StyleDictionaryPackage.registerTransform({
		name: "sizes/px",
		type: "value",
		matcher: function (prop) {
			// You can be more specific here if you only want 'em' units for font sizes
			return [
				"fontSizes",
				"spacing",
				"borderRadius",
				"borderWidth",
				"lineHeights",
				"paragraphSpacing",
			].includes(prop.original.type || "");
		},
		transformer: function (prop) {
			// You can also modify the value here if you want to convert pixels to ems
			return parseFloat(prop.original.value) + "px";
		},
	});

	StyleDictionaryPackage.registerTransform({
		name: "fontWeight",
		type: "value",
		matcher: function (prop) {
			// You can be more specific here if you only want 'em' units for font sizes
			return ["fontWeights"].includes(prop.original.type || "");
		},
		transformer: function (prop) {
			const fontWeightMap = {
				thin: 100,
				extralight: 200,
				ultralight: 200,
				extraleicht: 200,
				light: 300,
				leicht: 300,
				normal: 400,
				regular: 400,
				buch: 400,
				medium: 500,
				kraeftig: 500,
				kräftig: 500,
				semibold: 600,
				demibold: 600,
				halbfett: 600,
				bold: 700,
				dreiviertelfett: 700,
				extrabold: 800,
				ultabold: 800,
				fett: 800,
				black: 900,
				heavy: 900,
				super: 900,
				extrafett: 900,
			};

			const value = prop.value as string | undefined | number;
			if (value === undefined) {
				return value;
			}

			const mapped = Object.entries(fontWeightMap).filter(
				([key]) => key === value.toString().toLocaleLowerCase()
			);

			if (mapped[0]) {
				return mapped[0][1];
			}

			return value;
		},
	});

	StyleDictionaryPackage.registerTransform({
		name: "letterSpacing",
		type: "value",
		matcher: function (prop) {
			// You can be more specific here if you only want 'em' units for font sizes
			return ["letterSpacing"].includes(prop.original.type || "");
		},
		transformer: function (prop) {
			const value = prop.value as string;
			if (value === undefined) {
				return value;
			}

			if (value.includes("%")) {
				const percentage = parseFloat(value);
				if (Math.sign(percentage) === -1) {
					return "-" + (Math.abs(percentage) / 100).toString() + "rem";
				} else {
					return (percentage / 100).toString() + "rem";
				}
			} else {
				return value + "px";
			}
		},
	});

	generateRootTheme();
	generateTheme([
		{
			themeName: "light",
			themePath: "tokens/theme/light.json",
		},
		{
			themeName: "dark",
			themePath: "tokens/theme/dark.json",
		},
	]);
}

function generateTheme(themes: { themeName: string; themePath: string }[]) {
	for (const theme of themes) {
		const StyleDictionary = StyleDictionaryPackage.extend({
			source: ["tokens/global.json", theme.themePath],
			format: {
				cssVariables: ({ dictionary }) => {
					const colours = dictionary.allTokens.filter(
						(e) => e.type === "color"
					);
					const colourCSS = colours
						.map((e) => `--${e.name}: ${e.value};`)
						.join("\n");

					const boxShadows = dictionary.allTokens.filter(
						(e) => e.type === "boxShadow"
					);
					const boxShadowCSS = boxShadows
						.map(
							(e) =>
								`--${e.name}: ${e.value.x}px ${e.value.y}px ${e.value.blur}px ${e.value.spread}px ${e.value.color};`
						)
						.join("\n");

					return `[data-theme="${theme.themeName}"] {
            ${colourCSS}
            ${boxShadowCSS}
          }`;
				},
			},
			platforms: {
				tailwind: {
					transforms: [
						"attribute/cti",
						"name/cti/kebab",
						"sizes/px",
						"fontWeight",
						"letterSpacing",
					],
					buildPath: "dist/theme/",
					files: [
						{
							destination: `${theme.themeName}.css`,
							format: "cssVariables",

							// We don't want to use the style in the global. They are more like a foundation
							// Users of the design token should use the style in the semantic and theme folder
							filter: (token) => token.filePath !== "tokens/global.json",
						},
					],
					options: {
						log: "error",
					},
				},
			},
		});

		StyleDictionary.buildAllPlatforms();
	}
}

function generateRootTheme() {
	const StyleDictionary = StyleDictionaryPackage.extend({
		source: [
			"tokens/global.json",
			"tokens/semantic/colour.json",
			"tokens/semantic/comp.json",
		],
		format: {
			cssVariables: ({ dictionary }) => {
				const colours = dictionary.allTokens.filter((e) => e.type === "color");
				const colourCSS = colours
					.map((e) => `--${e.name}: ${e.value};`)
					.join("\n");

				const boxShadows = dictionary.allTokens.filter(
					(e) => e.type === "boxShadow"
				);

				const boxShadowCSS = boxShadows
					.map(
						(e) =>
							`--${e.name}: ${e.value.x}px ${e.value.y}px ${e.value.blur}px ${e.value.spread}px ${e.value.color};`
					)
					.join("\n");

				return `:root {
          ${colourCSS}
          ${boxShadowCSS}
        }`;
			},
		},
		platforms: {
			tailwind: {
				transforms: ["attribute/cti", "name/cti/kebab", "sizes/px"],
				buildPath: "dist/theme/",
				files: [
					{
						destination: `root.css`,
						format: "cssVariables",

						// We don't want to use the style in the global. They are more like a foundation
						// Users of the design token should use the style in the semantic and theme folder
						filter: (token) => token.filePath !== "tokens/global.json",
					},
				],
				options: {
					log: "error",
				},
			},
		},
	});

	StyleDictionary.buildAllPlatforms();
}

main();
