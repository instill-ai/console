import { authValidateTokenAction, useQuery } from "@instill-ai/toolkit";
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

      console.log("accessToken", accessToken);

      await authValidateTokenAction({ accessToken });

      return Promise.resolve(accessToken);
    },
    {
      onError: async (error) => {
        console.error(
          "Something went wrong when try to get accessToken",
          error
        );

        await axios.post("/api/remove-user-cookie", {
          key: "instill-auth-session",
        });

        await router.push("/login");
      },
      retry: false,
      refetchOnWindowFocus: false,
    }
  );
}
