import { join } from "path";
import fs from "fs";
import { serialize } from "next-mdx-remote/serialize";
import { remarkCodeHike } from "@code-hike/mdx";
import { GetCodeHikeTemplateSourceProps } from ".";

export const getCodeHikeTemplateSource = async ({
  templateName,
  replaceRules,
  showCopyButton,
}: GetCodeHikeTemplateSourceProps) => {
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
