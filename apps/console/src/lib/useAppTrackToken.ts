"use client";

import { useQuery } from "@instill-ai/toolkit";
import axios from "axios";
import { useRouter } from "next/navigation";

export function useAppTrackToken({ enabled }: { enabled: boolean }) {
  const router = useRouter();
  return useQuery({
    queryKey: ["trackToken"],
    queryFn: async (): Promise<string> => {
      try {
        const { data } = await axios.post("/api/get-user-cookie", {
          key: "instill-ai-user",
        });

        const trackToken = JSON.parse(data).cookie_token;

        if (!trackToken) {
          throw new Error("No trackToken in response");
        }

        return Promise.resolve(trackToken);
      } catch (error) {
        console.error("Something went wrong when try to get trackToken", error);

        router.push("/onboarding");
        return Promise.reject(error);
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
    enabled,
  });
}
