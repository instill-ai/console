import { NextApiResponse } from "next";
import { serialize } from "cookie";
import { Nullable } from "@/types/general";

export type SetCookiePayload = {
  res: NextApiResponse;
  value: string;
  key: string;
  domain: Nullable<string>;
  maxAge: number;
  httpOnly: boolean;
};

export const setCookie = ({
  res,
  value,
  key,
  domain,
  maxAge,
  httpOnly,
}: SetCookiePayload) => {
  const cookie = serialize(key, value, {
    maxAge: maxAge,
    expires: new Date(Date.now() + maxAge * 1000),
    httpOnly: httpOnly,
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
