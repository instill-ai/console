import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
  fetchUser,
} from "@instill-ai/toolkit/server";
import { ProfilePageRender } from "./render";
import { Metadata } from "next";
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

    const metadata: Metadata = {
      title: `Instill Core | ${params.entity}`,
      description: user.profile?.bio,
      openGraph: {
        images: ["/instill-open-graph.png"],
      },
    };

    return Promise.resolve(metadata);
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
}

export default async function Page() {
  const queryClient = new QueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfilePageRender />
    </HydrationBoundary>
  );
}
