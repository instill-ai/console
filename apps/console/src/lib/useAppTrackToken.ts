"use client";

import { useRouter } from "next/navigation";
import axios from "axios";

import { useQuery } from "@instill-ai/toolkit";

export function useAppTrackToken({ enabled }: { enabled: boolean }) {
  const router = useRouter();
  return useQuery({
    queryKey: ["trackToken"],
    queryFn: async (): Promise<string> => {
      try {
        const { data } = await axios.post("/api/get-user-cookie", {
          key: "instill-ai-user",
        });

        const trackToken = JSON.parse(data).cookieToken;

        if (!trackToken) {
          router.push("/onboarding");
        }

        return Promise.resolve(trackToken);
      } catch (error) {
        console.error("Something went wrong when try to get trackToken", error);

        router.push("/onboarding");
        return Promise.reject(error);
      }
    },
    refetchOnWindowFocus: false,
    enabled,
  });
}
