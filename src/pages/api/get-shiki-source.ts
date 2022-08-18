import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, body } = req;

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }

  if (!body.source) {
    res.status(500).end(`source not provided`);
  }

  const { source } = body;

  try {
    const shiki = await import("shiki");
    const highlighter = await shiki.getHighlighter({
      theme: "rose-pine-moon",
    });

    const shikiSource = highlighter.codeToHtml(source, { lang: "bash" });

    return res.status(200).json(shikiSource);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export default handler;
