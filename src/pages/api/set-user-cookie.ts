import { setCookie, SetCookiePayload } from "@/lib/cookie";
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

  if (!process.env.NEXT_PUBLIC_CONSOLE_BASE_URL) {
    return res.status(500).end("Env CONSOLE_BASE_URL is not provided");
  }

  try {
    const payload: SetCookiePayload = {
      res: res,
      key: "instill-ai-user",
      value: JSON.stringify({
        cookie_token: body.token,
      }),
      hostname: req.headers.host ?? null,
      maxAge: 60 * 60 * 24 * 30,
      httOnly: process.env.NODE_ENV === "production" ? true : false,
    };

    setCookie(payload);

    return res.status(200).json({
      status: "ok",
    });
  } catch (err) {
    return res.status(500).end(String(err));
  }
};

export default handler;
