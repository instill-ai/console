import { NextApiResponse } from "next";
import { serialize } from "cookie";
import { Nullable } from "@/types/general";
import { env } from "@/utils";

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
  console.log(
    "setCookie",
    env("NEXT_PUBLIC_SET_SECURE_COOKIE"),
    env("NEXT_PUBLIC_SET_SECURE_COOKIE") === "true" ? true : false,
    env("NEXT_PUBLIC_INSTILL_AI_USER_COOKIE_NAME")
  );

  const cookie = serialize(key, value, {
    maxAge: maxAge,
    expires: new Date(Date.now() + maxAge * 1000),
    httpOnly: httpOnly,
    secure: env("NEXT_PUBLIC_SET_SECURE_COOKIE") === "true" ? true : false,
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
