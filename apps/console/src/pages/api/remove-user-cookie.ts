import { NextApiRequest, NextApiResponse } from "next";

import { env, removeCookie } from "@instill-ai/toolkit/server";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }

  if (!env("NEXT_PUBLIC_CONSOLE_BASE_URL")) {
    return res.status(500).end("Env CONSOLE_BASE_URL is not provided");
  }

  let body;
  try {
    // Try parsing the body as JSON (for fetch requests)
    body = JSON.parse(req.body);
  } catch {
    // If parsing fails, assume it's already an object (for axios requests)
    body = req.body;
  }

  if (!body.key) {
    return res.status(500).end("Key not provided");
  }

  const targetCookie = req.cookies[body.key];

  try {
    if (targetCookie) {
      removeCookie({
        res,
        key: body.key,
      });
    }

    return res.status(200).json({
      status: "ok",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).end(String(err));
  }
};

export default handler;
