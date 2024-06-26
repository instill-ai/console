import { cookies } from "next/headers";

import { Nullable } from "@instill-ai/toolkit";

export const GET = () => {
  const cookieStore = cookies();
  const authSessionCookie = cookieStore.get("instill-auth-session")?.value;

  let accessToken: Nullable<string> = null;

  if (authSessionCookie) {
    accessToken = JSON.parse(authSessionCookie).accessToken;
  }

  return Response.json({
    accessToken: accessToken,
  });
};
