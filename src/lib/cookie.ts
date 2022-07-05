import { NextApiResponse } from "next";
import { serialize } from "cookie";
import { Nullable } from "@/types/general";

export const setCookie = (
  res: NextApiResponse,
  value: string,
  key: string,
  domain: Nullable<string>,
  maxAge: number,
  httOnly: boolean
) => {
  const cookie = serialize(key, value, {
    maxAge: maxAge,
    expires: new Date(Date.now() + maxAge * 1000),
    httpOnly: httOnly,
    secure: process.env.NODE_ENV === "production" ? true : false,
    path: "/",
    sameSite: "lax",
    domain: domain ? domain : undefined,
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
