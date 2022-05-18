import { NextApiResponse } from "next";
import { serialize } from "cookie";

export const setCookie = (
  res: NextApiResponse,
  token: string,
  tokenName: string,
  maxAge: number
) => {
  const cookie = serialize(tokenName, token, {
    maxAge: maxAge,
    expires: new Date(Date.now() + maxAge * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });

  res.setHeader("Set-Cookie", cookie);
};

export const removeCookie = (res: NextApiResponse, tokenName: string) => {
  const cookie = serialize(tokenName, "", {
    maxAge: -1,
    path: "/",
  });

  res.setHeader("Set-Cookie", cookie);
};
