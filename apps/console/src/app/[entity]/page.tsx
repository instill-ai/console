import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
  fetchUser,
  prefetchUser,
  prefetchUserPipelines,
} from "@instill-ai/toolkit/server";
import { ProfileViewPageRender } from "./render";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { Nullable, User } from "@instill-ai/toolkit";

type Props = {
  params: { id: string; entity: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cookieStore = cookies();
  const authSessionCookie = cookieStore.get("instill-auth-session")?.value;

  let accessToken: Nullable<string> = null;

  if (authSessionCookie) {
    accessToken = JSON.parse(authSessionCookie).access_token;
  }

  let authenticatedUser: Nullable<User> = null;

  try {
    authenticatedUser = await fetchUser({
      userName: "users/" + params.entity,
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

export default async function Page({ params }: Props) {
  const queryClient = new QueryClient();

  const cookieStore = cookies();
  const authSessionCookie = cookieStore.get("instill-auth-session")?.value;

  let accessToken: Nullable<string> = null;

  if (authSessionCookie) {
    accessToken = JSON.parse(authSessionCookie).access_token;
  }

  console.log({ accessToken });

  await prefetchUser({
    userName: "users/" + params.entity,
    accessToken: accessToken ?? null,
    queryClient: queryClient,
  });

  await prefetchUserPipelines({
    userName: "users/" + params.entity,
    accessToken: accessToken ?? null,
    queryClient: queryClient,
    filter: null,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileViewPageRender />
    </HydrationBoundary>
  );
}
