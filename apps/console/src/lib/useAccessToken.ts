import * as React from "react";
import {
  InstillStore,
  authValidateTokenAction,
  useInstillStore,
  useQuery,
  useShallow,
} from "@instill-ai/toolkit";
import axios from "axios";
import { useRouter } from "next/router";

const selector = (store: InstillStore) => ({
  updateAccessToken: store.updateAccessToken,
  updateEnabledQuery: store.updateEnabledQuery,
});

type UseAccessTokenProps = {
  stopRedirectingVisitor?: boolean;
};

export function useAccessToken(props?: UseAccessTokenProps) {
  const stopRedirectingVisitor = props?.stopRedirectingVisitor ?? false;
  const router = useRouter();

  const { updateAccessToken, updateEnabledQuery } = useInstillStore(
    useShallow(selector)
  );

  const [enabledQuery, setEnabledQuery] = React.useState(false);

  const accessToken = useQuery(
    ["accessToken"],
    async (): Promise<string> => {
      const { data } = await axios.post("/api/get-user-cookie", {
        key: "instill-auth-session",
      });

      const accessToken = JSON.parse(data).access_token;

      if (!accessToken) {
        throw new Error("No accessToken in response");
      }

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

        if (stopRedirectingVisitor) {
          return;
        }

        await router.push("/login");
      },
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  React.useEffect(() => {
    if (accessToken.isError) {
      updateAccessToken(() => null);
      updateEnabledQuery(() => false);
      setEnabledQuery(false);
      return;
    }

    if (!accessToken.isSuccess || !accessToken.data) {
      updateAccessToken(() => null);
      updateEnabledQuery(() => false);
      setEnabledQuery(false);
      return;
    }

    updateAccessToken(() => accessToken.data);
    updateEnabledQuery(() => true);
    setEnabledQuery(true);
  }, [accessToken.isSuccess, accessToken.data, accessToken.isError]);

  return { accessToken, enabledQuery };
}
