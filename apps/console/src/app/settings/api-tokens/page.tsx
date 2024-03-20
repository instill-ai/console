import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
  prefetchAuthenticatedUser,
  fetchAuthenticatedUser,
  prefetchApiTokens,
} from "@instill-ai/toolkit/server";
import { APITokensViewPageRender } from "./render";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { AuthenticatedUser, Nullable } from "@instill-ai/toolkit";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = cookies();
  const authSessionCookie = cookieStore.get("instill-auth-session")?.value;

  let accessToken: Nullable<string> = null;

  if (authSessionCookie) {
    accessToken = JSON.parse(authSessionCookie).access_token;
  }

  let authenticatedUser: Nullable<AuthenticatedUser> = null;

  try {
    authenticatedUser = await fetchAuthenticatedUser({
      accessToken: accessToken,
    });

    return Promise.resolve({
      title: `${authenticatedUser.id} | User`,
      description: authenticatedUser.profile?.bio,
      openGraph: {
        images: ["/instill-open-graph.png"],
      },
    });
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
}

export default async function Page() {
  const queryClient = new QueryClient();

  const cookieStore = cookies();
  const authSessionCookie = cookieStore.get("instill-auth-session")?.value;

  let accessToken: Nullable<string> = null;

  if (authSessionCookie) {
    accessToken = JSON.parse(authSessionCookie).access_token;
  }

  await prefetchAuthenticatedUser({
    accessToken,
    queryClient,
  });

  await prefetchApiTokens({
    accessToken,
    queryClient,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <APITokensViewPageRender />
    </HydrationBoundary>
  );
}
