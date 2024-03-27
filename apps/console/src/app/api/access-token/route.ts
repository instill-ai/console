import { Nullable } from "@instill-ai/toolkit";
import { cookies } from "next/headers";

export const GET = () => {
  const cookieStore = cookies();
  const authSessionCookie = cookieStore.get("instill-auth-session")?.value;

  let accessToken: Nullable<string> = null;

  if (authSessionCookie) {
    accessToken = JSON.parse(authSessionCookie).access_token;
  }

  return Response.json({
    access_token: accessToken,
  });
};
