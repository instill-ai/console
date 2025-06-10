import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { authLogoutAction } from "@instill-ai/toolkit/server";

export async function GET() {
  const cookieStore = await cookies();
  const accessTokenKey = "instill-auth-session";
  const accessToken = cookieStore.get(accessTokenKey);

  try {
    if (accessToken) {
      await authLogoutAction({
        accessToken: JSON.parse(accessToken.value).accessToken,
      });
      cookieStore.delete(accessTokenKey);

      redirect("/login");
    }
  } catch (error) {
    console.error(error);
    redirect("/login");
  }
}
