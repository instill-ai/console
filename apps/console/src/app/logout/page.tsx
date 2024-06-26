import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { authLogoutAction } from "@instill-ai/toolkit/server";

export default async function Page() {
  const cookieStore = cookies();
  const accessTokenKey = "instill-auth-session";
  const accessToken = cookieStore.get(accessTokenKey);

  try {
    if (accessToken) {
      await authLogoutAction({ accessToken: accessToken.value });
    }
  } catch (error) {
    console.error(error);
  }

  redirect("/login");
}
