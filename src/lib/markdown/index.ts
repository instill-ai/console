import { join } from "path";
import fs from "fs";
import { readFile } from "fs/promises";
import { serialize } from "next-mdx-remote/serialize";
import { remarkCodeHike } from "@code-hike/mdx";

/**
 * Get template from /src/lib/markdown/template and generate code-block
 * template with code-hike and rose-pine-moon theme
 */

export const getCodeTemplateMdxSource = async (templateName: string) => {
  try {
    const templatePath = join(
      process.cwd(),
      "src",
      "lib",
      "markdown",
      "template",
      templateName
    );
    const template = fs.readFileSync(templatePath, { encoding: "utf-8" });

    const theme = JSON.parse(
      await readFile(
        join(process.cwd(), "src", "styles", "rose-pine-moon.json"),
        {
          encoding: "utf-8",
        }
      )
    );

    const templateSource = await serialize(template, {
      parseFrontmatter: false,
      mdxOptions: {
        useDynamicImport: true,
        remarkPlugins: [
          [
            remarkCodeHike,
            {
              theme,
              lineNumbers: false,
              showCopyButton: true,
              autoImport: false,
            },
          ],
        ],
      },
    });

    return Promise.resolve(templateSource);
  } catch (err) {
    return Promise.reject(err);
  }
};
