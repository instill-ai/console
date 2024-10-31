import type { Nullable, User } from "instill-sdk";
import type { Metadata } from "next";

import { fetchUser, generateNextMetaBase } from "@instill-ai/toolkit/server";

import { ProfilePageRender } from "./render";

type Props = {
  params: { id: string; entity: string };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  try {
    let user: Nullable<User> = null;

    user = await fetchUser({
      userId: params.entity,

      // This is a public route, we don't need to request it with access token
      accessToken: null,
    });

    const metadata: Metadata = {
      title: `Instill Core | ${params.entity}`,
      metadataBase: generateNextMetaBase({
        defaultBase: "http://localhost:3000",
      }),
      description: user.profile?.bio,
      openGraph: {
        images: ["/instill-open-graph.png"],
      },
    };

    return Promise.resolve(metadata);
  } catch (error) {
    console.log(error);
  }
}

export default async function Page() {
  return <ProfilePageRender />;
}
