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

        // Check if data exists and is not null
        if (!data) {
          console.warn("No data received from get-user-cookie API");
          router.push("/onboarding");
          return Promise.reject(new Error("No data received"));
        }

        // Try to parse the data if it's a string, otherwise use it directly
        let parsedData;
        try {
          parsedData = typeof data === "string" ? JSON.parse(data) : data;
        } catch (parseError) {
          console.warn("Failed to parse cookie data:", parseError);
          // If parsing fails, treat the data as the token directly
          parsedData = { cookieToken: data };
        }

        const trackToken = parsedData?.cookieToken;

        if (!trackToken) {
          console.warn("No trackToken found in cookie data");
          router.push("/onboarding");
          return Promise.reject(new Error("No trackToken found"));
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
