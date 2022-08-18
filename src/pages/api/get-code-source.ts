import { NextApiRequest, NextApiResponse } from "next";
import { join } from "path";
import fs from "fs";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, body } = req;

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }

  if (!body.templateName) {
    res.status(500).end(`templateName not provided`);
  }

  if (!body.match) {
    res.status(500).end(`match not provided`);
  }

  if (!body.value) {
    res.status(500).end(`value not provided`);
  }

  const { templateName, match, value } = body;

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
    const codeStr = template.replaceAll(match, value);
    return res.status(200).json(codeStr);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export default handler;
