import { useQuery } from "@instill-ai/toolkit";
import axios from "axios";
import { useRouter } from "next/router";

export function useAccessToken() {
  const router = useRouter();
  return useQuery(
    ["accessToken"],
    async (): Promise<string> => {
      const { data } = await axios.post("/api/get-user-cookie", {
        key: "instill-auth-session",
      });

      const accessToken = JSON.parse(data).access_token;

      if (!accessToken) {
        throw new Error("No accessToken in response");
      }

      return Promise.resolve(accessToken);
    },
    {
      onError: (error) => {
        console.error(
          "Something went wrong when try to get accessToken",
          error
        );

        router.push("/login");
      },
      retry: false,
      refetchOnWindowFocus: false,
    }
  );
}
