import { useQuery } from "@instill-ai/toolkit";
import axios from "axios";
import { useRouter } from "next/router";

export function useTrackToken({ enabled }: { enabled: boolean }) {
  const router = useRouter();
  return useQuery(
    ["trackToken"],
    async (): Promise<string> => {
      const { data } = await axios.post("/api/get-user-cookie", {
        key: "instill-ai-user",
      });

      const trackToken = JSON.parse(data).cookie_token;

      if (!trackToken) {
        throw new Error("No trackToken in response");
      }

      return Promise.resolve(trackToken);
    },
    {
      onError: (error) => {
        console.error("Something went wrong when try to get trackToken", error);

        router.push("/onboarding");
      },
      retry: false,
      refetchOnWindowFocus: false,
      enabled,
    },
  );
}
