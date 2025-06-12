import { NextApiRequest, NextApiResponse } from "next";

import type { SetCookiePayload } from "@instill-ai/toolkit/server";
import { env, removeCookie, setCookie } from "@instill-ai/toolkit/server";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  if (method !== "POST") {
    console.log("Method not allowed");
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }

  if (!env("NEXT_PUBLIC_CONSOLE_BASE_URL")) {
    console.log("Env CONSOLE_BASE_URL is not provided");
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
    console.log("Key not provided");
    return res.status(500).end("Key not provided");
  }

  if (!body.value) {
    console.log("Value not provided");
    return res.status(500).end("Value not provided");
  }

  try {
    const targetCookie = req.cookies[body.key];
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
      secure: env("NEXT_PUBLIC_SET_SECURE_COOKIE") ?? false,
      domain: null,
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: env("NEXT_PUBLIC_SET_SECURE_COOKIE") ?? false,
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
