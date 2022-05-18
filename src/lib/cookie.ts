import { NextApiResponse } from "next";
import { serialize } from "cookie";

export const setCookie = (
  res: NextApiResponse,
  value: string,
  key: string,
  maxAge: number
) => {
  const cookie = serialize(key, value, {
    maxAge: maxAge,
    expires: new Date(Date.now() + maxAge * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });

  res.setHeader("Set-Cookie", cookie);
};

export const removeCookie = (res: NextApiResponse, key: string) => {
  const cookie = serialize(key, "", {
    maxAge: -1,
    path: "/",
  });

  res.setHeader("Set-Cookie", cookie);
};
