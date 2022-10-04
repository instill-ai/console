import { join } from "path";
import fs from "fs";
import { serialize } from "next-mdx-remote/serialize";
import { remarkCodeHike } from "@code-hike/mdx";

/**
 * Get template from /src/lib/markdown/template and generate code-block
 * with code-hike and rose-pine-moon theme
 */

type ReplaceRule = {
  match: string | RegExp;
  replaceValue: string;
};

export type getCodeHikeTemplateSourceProps = {
  templateName: string;
  replaceRules: ReplaceRule[];
  showCopyButton: boolean;
};

export const getCodeHikeTemplateSource = async ({
  templateName,
  replaceRules,
  showCopyButton,
}: getCodeHikeTemplateSourceProps) => {
  try {
    const templatePath = join(
      process.cwd(),
      "src",
      "lib",
      "markdown",
      "template",
      templateName
    );

    const theme = JSON.parse(
      fs.readFileSync(
        join(process.cwd(), "src", "styles", "rose-pine-moon.json"),
        { encoding: "utf-8" }
      )
    );

    let template = fs.readFileSync(templatePath, { encoding: "utf-8" });

    replaceRules.forEach((e) => {
      template = template.replace(new RegExp(e.match, "g"), e.replaceValue);
    });

    const templateSource = await serialize(template, {
      mdxOptions: {
        remarkPlugins: [
          [remarkCodeHike, { autoImport: false, theme, showCopyButton }],
        ],
        useDynamicImport: true,
      },
    });

    return Promise.resolve(templateSource);
  } catch (err) {
    return Promise.reject(err);
  }
};
