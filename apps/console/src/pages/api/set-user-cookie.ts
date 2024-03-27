import {
  setCookie,
  env,
  removeCookie,
  type SetCookiePayload,
} from "@instill-ai/toolkit/server";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, body } = req;

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }

  if (!body.key) {
    return res.status(500).end("Key not provided");
  }

  if (!body.value) {
    return res.status(500).end("Value not provided");
  }

  if (!env("NEXT_PUBLIC_CONSOLE_BASE_URL")) {
    return res.status(500).end("Env CONSOLE_BASE_URL is not provided");
  }

  const targetCookie = req.cookies[body.key];

  try {
    if (targetCookie) {
      removeCookie({
        res,
        key: body.key,
      });
    }

    const payload: SetCookiePayload = {
      res: res,
      key: body.key,
      value: body.value,
      secure: env("NEXT_PUBLIC_SET_SECURE_COOKIE") ?? true,
      domain: null,
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
    };

    setCookie(payload);

    return res.status(200).json({
      status: "ok",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).end(String(err));
  }
};

export default handler;
