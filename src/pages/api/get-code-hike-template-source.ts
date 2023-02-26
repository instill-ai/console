import { getCodeHikeTemplateSource } from "@/lib/markdown";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, body } = req;

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }

  if (!body.templateName) {
    res.status(500).end(`templateName not provided`);
  }

  if (!body.replaceRules) {
    res.status(500).end(`match not provided`);
  }

  if (!body.showCopyButton) {
    res.status(500).end(`match not provided`);
  }

  const { templateName, replaceRules, showCopyButton } = body;

  try {
    const source = await getCodeHikeTemplateSource({
      templateName,
      replaceRules,
      showCopyButton,
    });
    return res.status(200).json(source);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export default handler;
