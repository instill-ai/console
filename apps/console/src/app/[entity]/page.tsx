import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
  fetchUser,
  prefetchUser,
  prefetchUserPipelines,
} from "@instill-ai/toolkit/server";
import { ProfilePageRender } from "./render";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { Nullable, User } from "@instill-ai/toolkit";

type Props = {
  params: { id: string; entity: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    let user: Nullable<User> = null;

    user = await fetchUser({
      userName: "users/" + params.entity,

      // This is a public route, we don't need to request it with access token
      accessToken: null,
    });

    return Promise.resolve({
      title: `${user.id} | User`,
      description: user.profile?.bio,
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

  let accessToken: Nullable<string> = null;

  try {
    const cookieStore = cookies();
    const authSessionCookie = cookieStore.get("instill-auth-session")?.value;

    if (authSessionCookie) {
      accessToken = JSON.parse(authSessionCookie).access_token;
    }
  } catch (error) {
    console.error(error);
  }

  await prefetchUser({
    userName: "users/" + params.entity,
    accessToken: accessToken,
    queryClient: queryClient,
  });

  await prefetchUserPipelines({
    userName: "users/" + params.entity,
    accessToken: accessToken,
    queryClient: queryClient,
    filter: null,
    visibility: null,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfilePageRender />
    </HydrationBoundary>
  );
}
