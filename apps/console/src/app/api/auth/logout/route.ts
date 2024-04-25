import { authLogoutAction } from "@instill-ai/toolkit/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET() {
  const cookieStore = cookies();
  const accessTokenKey = "instill-auth-session";
  const accessToken = cookieStore.get(accessTokenKey);

  try {
    if (accessToken) {
      await authLogoutAction({
        accessToken: JSON.parse(accessToken.value).access_token,
      });
      cookieStore.delete(accessTokenKey);

      redirect("/login");
    }
  } catch (error) {
    console.error(error);
    redirect("/login");
  }
}
