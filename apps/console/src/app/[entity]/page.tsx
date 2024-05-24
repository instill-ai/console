import { fetchUser } from "@instill-ai/toolkit/server";
import { ProfilePageRender } from "./render";
import { Metadata } from "next";
import { Nullable, User } from "@instill-ai/toolkit";

type Props = {
  params: { id: string; entity: string };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
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
        images: [`/api/user?user=${params.entity}`],
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
