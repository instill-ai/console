import { setCookie } from "@/lib/cookie";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, body } = req;

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }

  if (!body.token) {
    return res.status(500).end("Token not provided");
  }

  const payload = {
    cookie_token: body.token,
  };

  setCookie(res, JSON.stringify(payload), "instill-ai-user", 60 * 60 * 24 * 30);

  return res.status(200).json({
    status: "ok",
  });
};

export default handler;
