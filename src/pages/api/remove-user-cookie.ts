import { removeCookie } from "@instill-ai/toolkit";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, cookies, body } = req;

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }

  if (!body.key) {
    return res.status(500).end("Key not provided");
  }

  const targetCookie = cookies[body.key];

  if (targetCookie) {
    removeCookie({
      res,
      key: body.key,
    });
  }

  return res.status(200).send("ok");
};

export default handler;
